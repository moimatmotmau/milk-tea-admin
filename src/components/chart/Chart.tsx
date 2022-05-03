import React from 'react'
import { Line } from '@ant-design/plots';
import { useState, useEffect } from 'react'
import axios from 'axios';
import { ordersApi } from '../../api/index'
import moment from 'moment';
import styles from './Chart.module.css'

const Chart = () => {
    interface chartData {
        month: any;
        amount: number;
    }
    const today = new Date();
    const api = `${ordersApi}`;
    const [dataFill, setDataFill] = useState<any>([]);
    const curMonth = String(today.getMonth() < 1 ? today.getMonth() + 12 : today.getMonth())
    const preMonth = String(today.getMonth() - 1 < 1 ? today.getMonth() + 11 : today.getMonth() - 1)
    const covertMonth = (month: string) => {
        switch (month) {
            case '1': return 'Jan'
            case '2': return 'Feb'
            case '3': return 'Mar'
            case '4': return 'Apr'
            case '5': return 'May'
            case '6': return 'Jun'
            case '7': return 'Jul'
            case '8': return 'Aug'
            case '9': return 'Sep'
            case '10': return 'Oct'
            case '11': return 'Nov'
            case '12': return 'Dec'
        }
    }
    const [data, setData] = useState<chartData[]>([
        {
            month: covertMonth(preMonth),
            amount: 0,
        },
        {
            month: covertMonth(curMonth),
            amount: 0
        },
        {
            month: covertMonth(String(today.getMonth() + 1)),
            amount: 0
        }
    ]);
    const getData = async () => {
        let updateOrder = await axios.get(api)
            .then(response => {
                setDataFill(response.data);
                setData([])
            })
            .then(() => {
                if (dataFill) {
                    let sumpre = 0;
                    let sumcur = 0;
                    let sumnex = 0;
                    const currMonth = dataFill.filter((item: any) => {
                        return moment(item.createAt).format('MMM') == covertMonth(curMonth)
                    })

                    currMonth.map((order: any) => {
                        order.orders.map((item: any) => {
                            sumcur += item.quantitySelect
                        })
                    })
                    const prevMonth = dataFill.filter((item: any) => {
                        return String(moment(item.createAt).format('MMM')) == covertMonth(preMonth)
                    })
                    prevMonth.map((order: any) => {
                        order.orders.map((item: any) => {
                            sumpre += item.quantitySelect
                        })
                    })
                    const nextMonth = dataFill.filter((item: any) => {
                        return moment(item.createAt).format('MMM') == covertMonth(String(today.getMonth() + 1))
                    })
                    nextMonth.map((order: any) => {
                        order.orders.map((item: any) => {
                            sumnex += item.quantitySelect
                        })
                    })

                    setData([
                        {
                            month: covertMonth(preMonth),
                            amount: sumpre,
                        },
                        {
                            month: covertMonth(curMonth),
                            amount: sumcur
                        },
                        {
                            month: covertMonth(String(today.getMonth() + 1)),
                            amount: sumnex
                        }
                    ])
                }
                else {
                    console.log('get data failed');
                }
            })
            .catch(error => console.log(error))
    }
    useEffect(() => {
        getData();
    }, [])
    const config = {
        data,
        xField: 'month',
        yField: 'amount',
        label: {},
        point: {
            size: 5,
            shape: 'diamond',
            style: {
                fill: 'white',
                stroke: '#5B8FF9',
                lineWidth: 2,
            },
        },
        tooltip: {
            showMarkers: false,
        },
        state: {
            active: {
                style: {
                    shadowBlur: 4,
                    stroke: '#000',
                    fill: 'red',
                },
            },
        },
        interactions: [
            {
                type: 'marker-active',
            },
        ],
    };

    return (
        <div>
            <Line {...config} />
            <div className={styles.chartTitle}>Số lượng sản phẩm bán được trong ba tháng gần nhất</div>
            <button className={styles.chartResetButton} onClick={()=>{getData()}}>Reset</button>
        </div>
    )
}

export default Chart