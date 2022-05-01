import React from 'react';
import { Modal, Table, Space } from 'antd';
import styles from './Details.module.css'

const { Column } = Table;

const Details: React.FC<{ details: boolean, setDetails: Function, record: any }> = ({ details, setDetails, record }) => {

    record.orders.map((order: { key: string | number; }, i: string | number) => {
        order.key = i
        record.orders[i] = order;
    });

    return (
        <>
            <Modal
                title={`Đơn hàng (${record.time})`}
                visible={details}
                centered
                onCancel={() => setDetails(false)}
                okButtonProps={{ hidden: true }}
                width={1500}
                style={{ top: 10 }}
            >
                <Table
                    dataSource={record.orders}
                    bordered
                    scroll={{ y: 300 }}
                    footer={(record: any) => {
                        let totalPrice: number = record.reduce((a: any, b: any) => a + Number(b.total), 0);
                        return `Tổng thanh toán: ${totalPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}`
                    }}
                >
                    <Column width={150} title="Tên" dataIndex="name" key="name" />
                    <Column width={95} title="Số lượng" dataIndex="quantitySelect" key="quantitySelect" />
                    <Column
                        width={60}
                        title="Size"
                        key="size"
                        render={(text, record: any) => (
                            <Space size="middle">
                                {record.size ? <span>L</span> : <span>M</span>}
                            </Space>
                        )}
                    />
                    <Column
                        width={100}
                        title="Đá"
                        key="ice"
                        render={(text, record: any) => (
                            <Space size="middle">
                                {record.ice ? <span>Có đá</span> : <span>Không đá</span>}
                            </Space>
                        )}
                    />
                    <Column
                        width={100}
                        title="Đường"
                        key="sugar"
                        render={(text, record: any) => (
                            <Space size="middle">
                                {record.sugar ? <span>100%</span> : <span>50%</span>}
                            </Space>
                        )}
                    />
                    <Column
                        width={350}
                        title="Topping"
                        key="topping"
                        render={(text, record: any) => (
                            <Space className={styles.topping} size="middle">
                                {record.topping.map((tp: any, index: any) => (
                                    tp === '1' ? <span key={index}>Trân châu sương mai</span> :
                                        tp === '2' ? <span key={index}>Hạt dẻ</span> :
                                            tp === '3' ? <span key={index}>Trân châu Baby</span> : ''
                                ))}
                            </Space>
                        )}
                    />
                    <Column width={120} title="Đơn giá" key="price"
                        render={(text, record: any) => (
                            <Space size="middle">
                                <span>{Number(record.price).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                            </Space>
                        )}
                    />
                    <Column width={120} title="Thành tiền" key="total"
                        render={(text, record: any) => (
                            <Space size="middle">
                                <span>{Number(record.total).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                            </Space>
                        )}
                    />
                </Table>
            </Modal>
        </>
    )
}

export default Details