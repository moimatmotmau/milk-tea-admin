import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Table, Space, Input, Checkbox, Modal, Form, Select, Radio, message, Spin } from 'antd';
import styles from '../Products/Product.module.css'
import { AudioOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import style from './Product.module.css'
import { Link } from 'react-router-dom';
import { productsApi, imageApi } from '../../api';




const api = `${productsApi}`;
const apiImage = `${imageApi}`;

interface ProductObject {
    lenght: any;
    name: string;
    price: string;
    salePrice: string;
    image: string;
    category: string;
    sizeM: string;
    sizeL: string;
    id: string;
    key: string;
    created_at: string;
}

const Product = () => {
    const [data, setData] = useState<ProductObject[]>([]);
    const [list, setList] = useState<ProductObject[]>([]);
    const [spin, setSpin] = useState<boolean>(true);
    const [reRender, setReRender] = useState<any>('');
    const [isEditing, setEditing] = useState(false);
    const [editProduct, setEditProduct] = useState<any>('')
    const Option = Select.Option;
    const [form] = Form.useForm();
    const [image, setImage] = useState<any>();
    const [imageSelected, setImageSelected] = useState<any>();

    const { Column } = Table;
    const { confirm } = Modal;

    useEffect(() => {
        axios.get(api)
            .then((response) => {
                setData(response.data)
                setList(response.data)
                setSpin(false)
            })
    }, [reRender])

    useEffect(() => {
        return () => {
            image && URL.revokeObjectURL(image.preview)
        }
    }, [image])

    data.map((product, i) => {
        product.key = product.id
        data[i] = product;
    })

    function showConfirmDelete(id: string) {
        confirm({
            title: 'Bạn chắc chắn muốn xóa sản phẩm này?',
            icon: <ExclamationCircleOutlined />,
            content: 'Sản phẩm sẽ bị xóa vĩnh viễn',
            onOk() {
                if (data.length < 1) {
                    message.error('Không thể xóa hết tất cả các sản phẩm!')
                } else {
                    console.log('client id: ',id)
                    axios.delete(`${api}/${id}`)
                        .then(response => {
                            setReRender(id)
                            message.success('Xóa sản phẩm thành công')
                        })
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    const { Search } = Input;

    const onSearch = (value: any) => {
        let users = data.filter(user => {
            return user.name.toLowerCase().includes(value.toLowerCase());
        })
        setList(users);
    };

    const onedit = (record: any) => {
        setEditing(true);
        setEditProduct(record)
    };

    const handleImageChange = (data: any) => {
        if (data) {
            setImageSelected(data)
            const img = data
            img.preview = URL.createObjectURL(data)
            setImage(img)
        } else {
            setImage('')
        }
    }

    const resetEditing = () => {
        setEditing(false);
    }

    const handleEditSubmit = (values: any) => {
        if (imageSelected) {
            const formData = new FormData();
            formData.append("file", imageSelected);
            formData.append("upload_preset", "VMilkTea");

            axios.post(apiImage, formData)
                .then(response => {
                    // Assign data to Cloudinary image URL
                    values.image = response.data.secure_url
                    // Put data to Api
                    console.log(values._id)
                    axios.put(`${api}/update/${values._id}`, values)
                        .then((res) => {
                            message.success('Thay đổi thành công')
                            setEditing(false);
                            setReRender(res)
                        })
                        .catch(err => message.error('Có lỗi xảy ra'))
                })
                .catch(err => message.error('Có lỗi xảy ra'))
        } else {
            axios.put(`${api}/update/${values._id}`, values)
                .then((res) => {
                    message.success('Thay đổi thành công')
                    setEditing(false);
                    setReRender(res)
                })
                .catch(err => message.error('Có lỗi xảy ra'))
        }
    }

    return (
        <>
            <Search
                placeholder="Tìm kiếm tên sản phẩm"
                enterButton="Tìm kiếm"
                size="large"
                onSearch={onSearch}
            />

            <Link to="/AddProducts" className={style.btn} >
                Thêm sản phẩm
            </Link>

            {spin ? <Spin></Spin> :
                <Table
                    bordered
                    dataSource={list}
                    className={style.table}
                    scroll={{ x: 300 }}
                    pagination={{ position: ['topLeft', 'bottomRight'] }}
                >
                    <Column title="Tên sản phẩm " dataIndex="name" key="name" />
                    <Column title="Giá bán " key="price"
                        render={(text, record: any) => (
                            <Space size="middle">
                                <span>{Number(record.price).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                            </Space>
                        )}
                    />
                    <Column title="Giá khuyến mại" key="salePrice"
                        render={(text, record: any) => (
                            <Space size="middle">
                                {record.salePrice && <span>{Number(record.salePrice).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>}
                            </Space>
                        )}
                    />
                    <Column title="Ảnh minh họa" key="image" render={(text, record: any) => (
                        <Space size="middle">
                            <img style={{ width: 100, height: 100, objectFit: 'cover' }}
                                src={record.image}
                            />
                        </Space>
                    )} />



                    <Column title="Loại sản phẩm" dataIndex="category" key="category" render={(text, record: any) => {
                        const a = record.category;
                        function SwitchCase(props: any): any {

                            switch (a) {

                                case '1':

                                    return 'Trà sữa';

                                case '2':

                                    return 'Fresh Fruit Tea';
                                case '3':

                                    return 'Machiato Cream Cheese';
                                case '4':

                                    return 'Sữa chua dẻo';
                                default:

                                    return 'Lỗi dữ liệu'


                            }

                        }
                        return (
                            <Space size="middle">
                                <SwitchCase />
                            </Space>
                        )

                    }

                    } />
                    <Column title="Kích thức sản phẩm" dataIndex="sizeM"
                        render={(text, record: any) => {
                            const a = record.sizeM;
                            const b = record.sizeL;
                            function SwitchCase(props: any): any {

                                if (!a) {
                                    return (<b style={{ color: '#9FC088' }}> Size L </b>)
                                } else if (!b) {
                                    return (<b style={{ color: '#E8C07D' }}> Size M </b>)
                                }
                                else {
                                    return (<b style={{ color: '#CC704B' }}> Size M và Size L </b>)
                                }
                            }
                            return (
                                <Space size="middle">
                                    <SwitchCase />
                                </Space>
                            )

                        }} />
                    <Column title="Sản phẩm hot" dataIndex="hot" render={(text, record: any) => {
                        return (
                            <Space size="middle">
                                {record.hot
                                    ?
                                    <p style={{ color: 'red' }}> Hot </p>
                                    :
                                    <p style={{ color: 'green' }}> Không hot </p>
                                }
                            </Space>
                        )

                    }} />
                    <Column
                        title="Thao tác"
                        key="action"
                        render={(text, record: any) => (

                            <Space size="middle">
                                <DeleteOutlined onClick={() => showConfirmDelete(record._id)}>Xóa</DeleteOutlined>
                                <EditOutlined onClick={() => { onedit(record); }}>Sửa </EditOutlined>
                            </Space>
                        )}
                    />

                </Table>}
            <Modal
                style={
                    {
                        width: '70%',
                    }
                }
                title="Sửa sản phẩm"
                visible={isEditing}
                okText="Save"
                onCancel={() => {
                    resetEditing()
                }}
                onOk={() => handleEditSubmit(editProduct)}
            >
                <Form form={form} name="register" initialValues={{ remember: true }}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 10 }}
                >
                    <Form.Item label="Tên sản phẩm"
                        rules={[
                            {
                                required: true,
                            },
                            { whitespace: true },
                            { min: 6 }
                        ]}
                        hasFeedback>
                        <Input value={editProduct.name} onChange={(e) => {
                            if (e.target.value.length < 3) {
                                message.error('Tên sản phẩm phải trên 5 ký tự')
                            }
                            else {
                                setEditProduct((pre: any) => {
                                    return { ...pre, name: e.target.value }
                                })
                            }
                        }} />
                    </Form.Item>
                    <Form.Item label="Giá bán" rules={[{
                        required: true,
                    },
                    { whitespace: true },
                    { min: 1 }
                    ]}
                        hasFeedback>
                        <Input value={editProduct.price} onChange={(e) => {
                            if (e.target.value === '') {
                                message.error('Không được để trống giá sản phẩm')
                            } else if (parseInt(e.target.value) < 0) {
                                message.error('Giá sản phẩm âm')
                            }
                            else {
                                setEditProduct((pre: any) => {
                                    return { ...pre, price: e.target.value }
                                })
                            }

                        }} />
                    </Form.Item>
                    <Form.Item label="Giá bán khuyến mãi" rules={[{
                        required: false
                    },
                    { whitespace: true },
                    { min: 1 }
                    ]}
                        hasFeedback>
                        <Input value={editProduct.salePrice} onChange={(e) => {
                            setEditProduct((pre: any) => {
                                return { ...pre, salePrice: e.target.value }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label="Loại sản phẩm" >
                        <Select placeholder="Loại sản phẩm"
                            style={{ width: '100%' }}
                            onChange={(e) => {

                                setEditProduct((pre: any) => {
                                    return { ...pre, category: e }
                                })
                            }}
                            value={editProduct.category}
                        >
                            <Option value="1">Trà sữa</Option>
                            <Option value="2">Fresh Fruit Tea</Option>
                            <Option value="3">Machiato Cream Cheese</Option>
                            <Option value="4">Sữa chua dẻo</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Ảnh sản phẩm"
                    >
                        <label htmlFor='iput_img' className={style.div}>
                            <input id='iput_img' style={{ display: 'none' }} type='file' onChange={(e: any) => {
                                handleImageChange(e.target.files[0])
                            }}
                            />
                            {image ?
                                <img
                                    className={styles.input_img}
                                    src={image.preview}
                                    alt="Anh"
                                    style={{ width: 100, height: 100, objectFit: 'cover' }}
                                />
                                :
                                <img
                                    className={styles.input_img}
                                    src={editProduct.image}
                                    alt="Anh"
                                    style={{ width: 100, height: 100, objectFit: 'cover' }}
                                />
                            }
                        </label>

                    </Form.Item>
                    <Form.Item name='size' label="Kích thước sản phẩm">
                        <Checkbox
                            value="1"
                            style={{ lineHeight: '32px' }}
                            checked={editProduct.sizeM}
                            onChange={() =>
                                setEditProduct((pre: any) => {
                                    return { ...pre, sizeM: !editProduct.sizeM }
                                })
                            }
                        >
                            Size M
                        </Checkbox>
                        <Checkbox
                            value="2"
                            style={{ lineHeight: '32px' }}
                            checked={editProduct.sizeL}
                            onChange={() =>
                                setEditProduct((pre: any) => {
                                    return { ...pre, sizeL: !editProduct.sizeL }
                                })
                            }
                        >
                            Size L
                        </Checkbox>

                    </Form.Item>
                    <Form.Item
                        label="Sản phẩm nổi bật"
                    >
                        <Radio.Group value={editProduct.hot} onChange={(e) => {
                            setEditProduct((pre: any) => {
                                return { ...pre, hot: !pre.hot }
                            })
                        }}>
                            <Radio value={true}>Có</Radio>
                            <Radio value={false}>Không</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default Product

function setSize(value: any): void {
    throw new Error('Function not implemented.');
}
