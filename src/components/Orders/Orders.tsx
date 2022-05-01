import { useState, useEffect } from 'react';
import { Table, Space, Spin, Checkbox, Select, Form, Input, Button } from 'antd';
import axios from 'axios';
import styles from './Orders.module.css'
import Details from './DetailsModal/Details';
import {usersApi, ordersApi} from '../../api/index'

const { Column, ColumnGroup } = Table;
const { Option } = Select;

interface RootObject {
    key: string;
    username: string;
    phone: string;
    address: string;
    orders: any[];
    totalPrice: string;
    paid: boolean;
    status: string;
    _id: string;
}

const initialValues = {
    key: '',
    username: '',
    phone: '',
    address: '',
    orders: [],
    totalPrice: '',
    paid: true,
    status: '',
    _id: ''
}

const api = `${ordersApi}`;
const apiUser = `${usersApi}`;
const Orders = () => {
    const [data, setData] = useState<RootObject[]>([]);
    const [details, setDetails] = useState<boolean>(false);
    const [spin, setSpin] = useState<boolean>(true);
    const [record, setRecord] = useState<RootObject>(initialValues);
    const [reRender, setReRender] = useState<any>()
    const [disabledCheckBox, setDisabledCheckBox] = useState<boolean>(false);
    const [disabledSelect, setDisabledSelect] = useState<boolean>(false);

    const [form] = Form.useForm();

    useEffect(() => {
        axios.get(api)
            .then(response => {
                setData(response.data.reverse())
                setSpin(false)
            })
            .catch(error => console.log(error))
    }, [reRender])

    data.map((order, i) => {
        order.key = order._id
        data[i] = order;
    })

    const handleDetails = (record: RootObject) => {
        setDetails(true);
        setRecord(record);
    }

    const handleFilterPaid = (value: any, record: any) => {
        return record.paid === value
    }

    const handleFilterStatus = (value: any, record: any) => {
        return record.status === value
    }

    const handleChangePaid = (value: any) => {
        setDisabledCheckBox(true)
        const paidStatus = value.paid
        // Up date paid status on Orders API
        axios.put(`${api}/${value._id}`, { ...value, paid: !paidStatus })
            .then(response => {
                setReRender(response.data)
                setDisabledCheckBox(false)
            })
            .catch(error => console.log('changed paid error',error))
        console.log('paidStatus: ', paidStatus)

        // Up date paid status on Users API
        axios.get(apiUser)
            .then(response => {
                const data = response.data;
                // Search user 
                const user = data.find((user: any) => user.username === value.username);
                if (user) {
                    // Search this order of user
                    const order = user.orders.find((order: any) => order.time === value.time);
                    let indexOrder = user.orders.indexOf(order);
                    // Update paid status
                    user.orders[indexOrder] = { ...value, paid: !paidStatus }
                    // Put to api
                    axios.put(`${apiUser}/${user.id}`, user)
                }
            })
    }

    const handleChangeStatus = (value: string, record: any) => {
        setDisabledSelect(true)
        // Up date status on Orders API
        axios.put(`${api}/${record._id}`, { ...record, status: value })
            .then(response => {
                setReRender(response.data)
                setDisabledSelect(false)
            })
            .catch(error => console.log(error))

        // Up date status on Users API
        axios.get(apiUser)
            .then(response => {
                const data = response.data;
                // Search user 
                const user = data.find((user: any) => user.username === record.username);
                if (user) {
                    // Search this order of user
                    const order = user.orders.find((order: any) => order.time === record.time);
                    let indexOrder = user.orders.indexOf(order);
                    // Update paid status
                    user.orders[indexOrder] = { ...record, status: value }
                    // Put to api
                    axios.put(`${apiUser}/${user.id}`, user)
                }
            })
    }

    const layout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 16 },
    };
    const tailLayout = {
        wrapperCol: { offset: 3, span: 16 },
    };

    const onFinish = async (values: any) => {
        setSpin(true)
        await axios.get(api)
            .then((res: any) => {
                const searchItem = res.data.filter((order: any) => (
                    order.fullName.toLowerCase().includes(values.fullName ? values.fullName.toLowerCase() : '') &&
                    order.address.toLowerCase().includes(values.address ? values.address.toLowerCase() : '') &&
                    order.phone.includes(values.phone ? values.phone : '')
                ))
                setData(searchItem.reverse())
                setSpin(false)
            })
    };

    const onReset = async () => {
        form.resetFields();
        setSpin(true)
        await axios.get(api)
            .then((res: any) => {
                setData(res.data.reverse())
                setSpin(false)
            })
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            <Details details={details} setDetails={setDetails} record={record} />
            <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
                <Form.Item name="fullName" label="Người đặt">
                    <Input />
                </Form.Item>
                <Form.Item name="address" label="Địa chỉ">
                    <Input />
                </Form.Item>
                <Form.Item name="phone" label="Số điện thoại">
                    <Input />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit" style={{ marginRight: '16px' }}>
                        Tìm kiếm
                    </Button>
                    <Button htmlType="button" onClick={onReset}>
                        Reset
                    </Button>
                </Form.Item>
            </Form>
            {spin ? <Spin /> :
                <Table
                    bordered
                    dataSource={data}
                    scroll={{ x: 250 }}
                    pagination={{ position: ['topLeft', 'bottomRight'] }}
                >
                    <ColumnGroup title="Thông tin đơn hàng">
                        <Column title="Người đặt" dataIndex="fullName" key="fullName" />
                        <Column title="Địa chỉ" dataIndex="address" key="address" />
                        <Column title="Số điện thoại" dataIndex="phone" key="phone" />
                        <Column
                            title="Đơn hàng"
                            key="orders"
                            render={(text, record: any) => (
                                <Space size="middle">
                                    <Button type="primary" onClick={() => handleDetails(record)}>Chi tiết</Button>
                                </Space>
                            )}
                        />
                    </ColumnGroup>

                    <ColumnGroup title="Trạng thái đơn hàng">
                        <Column
                            title="Thanh toán"
                            key="paid"
                            filters={[
                                {
                                    text: 'Đã thanh toán',
                                    value: true
                                },
                                {
                                    text: 'Chưa thanh toán',
                                    value: false
                                }
                            ]}
                            onFilter={(value, record) => handleFilterPaid(value, record)}
                            render={(text, record: any) => (
                                <Space size="middle">
                                    {record.paid ? <p className={styles.success}>Đã thanh toán</p> : <p className={styles.un_success}>Chưa thanh toán</p>}
                                    <Checkbox disabled={disabledCheckBox} defaultChecked={record.paid} onChange={() => handleChangePaid(record)}></Checkbox>
                                </Space>
                            )}
                        />
                        <Column
                            title="Giao hàng"
                            key="status"
                            filters={[
                                {
                                    text: 'Chờ xác nhận',
                                    value: '1'
                                },
                                {
                                    text: 'Đang giao hàng',
                                    value: '2'
                                },
                                {
                                    text: 'Đã giao hàng',
                                    value: '3'
                                }
                            ]}
                            onFilter={(value, record) => handleFilterStatus(value, record)}
                            render={(text, record: any) => (
                                <Space size="middle">
                                    {record.status === '1' ? <p className={styles.un_success}>Chờ xác nhận</p> :
                                        record.status === '2' ? <p className={styles.wait}>Đang giao hàng</p> :
                                            record.status === '3' ? <p className={styles.success}>Đã giao hàng</p> : ''
                                    }
                                    <Select disabled={disabledSelect} defaultValue={record.status} onChange={(e) => handleChangeStatus(e, record)}>
                                        <Option value="1">Chờ xác nhận</Option>
                                        <Option value="2">Đang giao hàng</Option>
                                        <Option value="3">Đã giao hàng</Option>
                                    </Select>
                                </Space>
                            )}
                        />
                    </ColumnGroup>
                </Table>}
        </div>
    )
}

export default Orders