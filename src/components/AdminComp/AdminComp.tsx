import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { accountState, initialValues } from '../RecoilProvider/RecoilProvider';
import { Button, Modal } from 'antd';
import { ExclamationCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import styles from './AdminComp.module.css'
import ChangePassword from './ChangePassword';

const Admin: React.FC<{ setLogin: Function }> = ({ setLogin }) => {
  const [account, setAcount] = useRecoilState(accountState);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const { confirm } = Modal;

  function showLogout(setLogin: Function) {
    confirm({
      title: 'Bạn chắc chắn muốn đăng xuất?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk() {
        localStorage.setItem('account', JSON.stringify(initialValues));
        setAcount(initialValues);
        setLogin(false);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <h1 className={styles.title}>Admin</h1>
      <Button className={styles.button} type="primary" shape="round" size={'large'} onClick={() => showModal()}>
        Đổi mật khẩu
      </Button>
      <ChangePassword isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
      <Button className={styles.button} type="primary" shape="round" size={'large'} onClick={() => showLogout(setLogin)}>
        <LogoutOutlined />Đăng xuất
      </Button>
    </div>
  )
}

export default Admin