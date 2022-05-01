import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, message } from 'antd';
import styles from './Login.module.css';
import { accountState } from '../RecoilProvider/RecoilProvider';
import { usersApi } from '../../api';


const Login: React.FC<{ setLogin: Function }> = ({ setLogin }) => {
    const [account, setAcount] = useRecoilState(accountState);
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const fetchData = async (url: string) => {
        const getData = await axios.get(url);
        const data = await getData.data;
        return data;
    }

    const onFinish = async (values: any) => {
        try {
            setLoading(true)
            axios.get(`${usersApi}`)
                .then(response => {
                    const datas: any[] = response.data
                    const userFound = datas.find(user => {
                        return user.username === values.username;
                    })
                    if (userFound && userFound.password === values.password) {
                        if (userFound.role === 'user') {
                            message.error('Tài khoản này không đủ quyền truy cập vào trang admin')
                            setLoading(false)
                        } else {
                            localStorage.setItem('account', JSON.stringify(userFound))
                            setAcount(userFound);
                            setLogin(true);
                            navigate('/')
                            message.success('Đăng nhập thành công')
                            setLoading(false)
                        }
                    }
                    else {
                        message.error('Tài khoản hoặc mật khẩu không đúng')
                        setLoading(false)
                    }
                })
        } catch (error) {
            message.error('Đã xảy ra lỗi, vui lòng tải lại trang');
        }

    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className={styles.login}>
            <h3 className={styles.login_title}>Đăng nhập</h3>
            <Form
                className={styles.login_form}
                name="basic"
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 12 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Tài khoản"
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản' }]}
                    className={styles.form_item}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    className={styles.form_item}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    wrapperCol={{ offset: 0, span: 16 }}
                    className={styles.form_item}>
                    <Button className={styles.login_btn} disabled={loading} type="primary" htmlType="submit">
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};


export default Login