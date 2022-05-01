import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Space, Input, Spin, message, Modal, Select } from 'antd';
import styles from './Users.module.css'
import { WarningOutlined } from '@ant-design/icons';
import { usersApi } from '../../api/index'
import { useRecoilState } from 'recoil';
import { accountState } from '../RecoilProvider/RecoilProvider';
import { useNavigate } from 'react-router-dom';


const api = `${usersApi}`;
interface RootObject {
    username: string;
    password: string;
    email: string;
    phone: string;
    fullName: string;
    age: string;
    avatar: string;
    address: string;
    cart: any[];
    orders: any[];
    role: string;
    id: string;
    key: string;
}

const Users: React.FC<{ setLogin: Function }> = ({ setLogin }) => {
    const [data, setData] = useState<RootObject[]>([]);
    const [list, setList] = useState<RootObject[]>([]);
    const [spin, setSpin] = useState<boolean>(true);
    const [reRender, setReRender] = useState<string>('');
    const [disabledSelect, setDisabledSelect] = useState<boolean>(false);
    const [account, setAccount] = useRecoilState(accountState);
    const navigate = useNavigate();
    const { Column } = Table;
    const { confirm } = Modal;
    const { Option } = Select;

    useEffect(() => {
        axios.get(api)
            .then((response) => {
                setData(response.data)
                setList(response.data)
                setSpin(false)
            })
    }, [reRender])
    data.map((user, i) => {
        user.key = user.id
        data[i] = user;
    })
    const currentUser = JSON.parse(localStorage.getItem('account') as any)
    function showConfirmDelete(id: string, role: string) {
        confirm({
            title: 'Bạn chắc chắn muốn xóa tài khoản này?',
            icon: <WarningOutlined />,
            content: 'Tài khoản sẽ bị xóa vĩnh viễn',
            onOk() {
                if (role === `admin`) {
                    message.error('Không thể xóa tài khoản này!')
                } else {
                    axios.delete(`${api}/${id}`)
                        .then(response => {
                            setReRender(id)
                            message.success('Xóa tài khoản thành công')
                        })
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    const onChangeInput = (value: string) => {
        let users = data.filter(user => {
            return user.username.toLowerCase().includes(value.toLowerCase())
        })
        setList(users);
    }
    const handleFilterRole = (value: any, record: any) => {
        return record.role === value
    }
    const handleChangeRole = (value: string, record: any) => {
        setDisabledSelect(true)
        axios.get(`${usersApi}`)
            .then(response => {
                const datas: any[] = response.data
                const userFound = datas.find(user => {
                    return user._id === record._id;
                })
                if (userFound) {
                    userFound.role = record.role
                }
            })
        if (record._id === currentUser._id) {
            confirm({
                title: 'Bạn có chắc muốn thay đổi quyền của tài khoản đang đăng nhập?',
                icon: <WarningOutlined />,
                content: 'Bạn phải đăng nhập lại sau khi cập nhật quyền!',
                onOk() {
                    // Up date status on Users API
                    axios.put(`${api}/${record._id}`, { ...record, role: value })
                        .then(response => {
                            setReRender(response.data)
                            setDisabledSelect(false)
                            localStorage.setItem('account', JSON.stringify({ ...record }))
                            setAccount({ ...record });
                            navigate('/')
                            setLogin(false)
                        })
                        .catch(error => console.log(error))
                },
                onCancel() {
                    setDisabledSelect(false)
                    axios.get(`${usersApi}`)
                        .then(response => {
                            const datas: any[] = response.data
                            const userFound = datas.find(user => {
                                return user._id === record._id;
                            })
                            if (userFound) {
                                record.role = userFound.role;
                            }
                        })
                },
            });
        } else {
            confirm({
                title: 'Bạn có chắc muốn thay đổi quyền của tài khoản này?',
                icon: <WarningOutlined />,
                content: 'Thận trọng khi thay đổi quyền của tài khoản!',
                onOk() {
                    // Up date status on Users API
                    axios.put(`${api}/${record._id}`, { ...record, role: value })
                        .then(response => {
                            setReRender(response.data)
                            setDisabledSelect(false)
                        })
                        .catch(error => console.log(error))
                },
                onCancel() {
                    setDisabledSelect(false)
                    axios.get(`${usersApi}`)
                        .then(response => {
                            const datas: any[] = response.data
                            const userFound = datas.find(user => {
                                return user._id === record._id;
                            })
                            if (userFound) {
                                record.role = userFound.role;
                            }
                        })
                },
            });
        }
    }
    return (
        <div style={{ minHeight: '100vh' }}>
            <Input
                placeholder="Tìm kiếm tài khoản..."
                allowClear
                size="large"
                onChange={(e) => onChangeInput(e.target.value)}
            />
            {spin ? <Spin className={styles.spin} /> :
                <Table
                    bordered
                    dataSource={list}
                    scroll={{ x: 300 }}
                    pagination={{ position: ['topLeft', 'bottomRight'] }}
                >
                    <Column title="Tên đăng nhập" dataIndex="username" key="username" />
                    <Column title="Mật khẩu" dataIndex="password" key="password" />
                    <Column title="Tên" dataIndex="fullName" key="username" />
                    <Column title="Địa chỉ" dataIndex="address" key="address" />
                    <Column title="Email" dataIndex="email" key="email" />
                    <Column title="Số điện thoại" dataIndex="phone" key="phone" />
                    <Column
                        title="Quyền"
                        key="role"
                        filters={[
                            {
                                text: 'Admin',
                                value: 'admin'
                            },
                            {
                                text: 'Staff',
                                value: 'staff'
                            },
                            {
                                text: 'User',
                                value: 'user'
                            }
                        ]}
                        onFilter={(value, record) => handleFilterRole(value, record)}
                        render={(text, record: any) => (
                            <Space size="middle">
                                <Select disabled={disabledSelect} value={record.role} defaultValue={record.role} onChange={(e) => handleChangeRole(e, record)}>
                                    <Option value="admin"><p style={{ color: '#ff0000' }}>Admin</p></Option>
                                    <Option value="staff"><p style={{ color: '#bfb810' }}>Staff</p></Option>
                                    <Option value="user"><p style={{ color: '#008000' }}>User</p></Option>
                                </Select>
                            </Space>
                        )}
                    />
                    <Column
                        title="Action"
                        key="action"
                        render={(text, record: any) => (
                            <Space size="middle">
                                <a onClick={() => showConfirmDelete(record._id, record.role)}>Xóa</a>
                            </Space>
                        )}
                    />
                </Table>}
        </div>
    )
}

export default Users