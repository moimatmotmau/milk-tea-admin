import { Button, Checkbox, Col, Form, Input, message, Radio, Row, Select } from "antd"
import React, { useEffect, useState } from "react"
import styles from '../Product.module.css'
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { productsApi, imageApi } from '../../../api/index';



const api = `${productsApi}`;
const apiImage = `${imageApi}`;

interface ProductObject {
    lenght: any;
    name: string;
    price: string;
    salePrice: string;
    image: string;
    category: string;
    sizeM: boolean;
    sizeL: boolean;
    hot: boolean;
    id: string;
    key: string;
}

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
};
const formTailLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 5 },
};

const AddProducts = () => {
    const [form] = Form.useForm();
    const Option = Select.Option;
    const [image, setImage] = useState<any>();
    const [imageSelected, setImageSelected] = useState<any>();
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

    let navigate = useNavigate();
    function handleChange(value: any) {
        console.log(`selected ${value}`);

    }
    const [datas, setDatas] = useState<ProductObject[]>([]);
    async function fetchData() {
        let response = await axios(api);
        let listProducts = await response.data;
        setDatas([...listProducts]);
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        return () => {
            image && URL.revokeObjectURL(image.preview)
        }
    }, [image])

    const onFinish = (values: any) => {
        setConfirmLoading(true);

        const formData = new FormData();
        formData.append("file", imageSelected);
        formData.append("upload_preset", "VMilkTea");

        axios.post(apiImage, formData)
            .then(response => {
                // Assign data to Cloudinary image URL
                values.image = response.data.secure_url
                if (values.size.length === 2) {
                    values.sizeM = true;
                    values.sizeL = true;
                } else if (values.size[0] === '1') {
                    values.sizeM = true;
                    values.sizeL = false;
                } else if (values.size[0] === '2') {
                    values.sizeM = false;
                    values.sizeL = true;
                }
                delete values.size;
                if (!values.hot) {
                    values.hot = false
                }
                if (!values.salePrice) {
                    values.salePrice = ''
                }

                // Post data to Api
                axios.post(api, values)
                    .then(() => {
                        message.success("Thêm sản phẩm thành công ")
                        setConfirmLoading(false)
                    })
                    .then(() => { navigate("/products", { replace: true }) })
                    .catch(err => message.error('Có lỗi xảy ra'))
            })
            .catch(err => message.error('Có lỗi xảy ra'))
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

    return (
        <div style={{ minHeight: '100vh' }}>
            <>
                <h2> Thêm sản phẩm </h2>
            </>
            <>

                <Form
                    {...layout}
                    form={form} name="register"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 10 }}
                >
                    <Form.Item name="name" label="Nhập tên sản phẩm"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên sản phẩm',
                            },
                            { whitespace: true },
                            { min: 6, message: 'Vui lòng nhập tối thiểu 6 ký tự' }
                        ]}
                        hasFeedback>
                        <Input name="name" className={`${Error.name ? 'is-invalid' : ''}`} placeholder="Tên sản phẩm" />
                    </Form.Item>
                    <Form.Item name="price" label="Nhập giá bán" rules={[{
                        required: true,
                        message: 'Vui lòng nhập giá bán',
                    },
                    { whitespace: true }
                    ]}
                        hasFeedback>
                        <Input name="price" min={1} style={{ width: '100%' }} placeholder="Nhập giá bán" />
                    </Form.Item>
                    <Form.Item name="salePrice" label="Nhập giá bán khuyến mãi" rules={[{
                        required: false
                    },
                    { whitespace: true }
                    ]}
                        hasFeedback>
                        <Input name="salePrice" min={1} style={{ width: '100%' }} placeholder="Giá khuyến mại" defaultValue='' />
                    </Form.Item>
                    <Form.Item name="category" label="Nhập loại sản phẩm" rules={[{
                        required: true,
                        message: 'Vui lòng chọn loại sản phẩm',
                    },]} hasFeedback>
                        <Select placeholder="Loại sản phẩm"
                            style={{ width: '100%' }}
                            onChange={handleChange}
                        >
                            <Option value="1">Trà sữa</Option>
                            <Option value="2">Fresh Fruit Tea</Option>
                            <Option value="3">Machiato Cream Cheese</Option>
                            <Option value="4">Sữa chua dẻo</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Thêm ảnh sản phẩm"
                        rules={[{
                            required: true,
                            message: 'Vui lòng chọn ảnh mô tả',
                        },]}
                    >
                        <label htmlFor="add_img" style={{ width: 100, height: 100, border: '1px solid #807a79', display: 'block', cursor: 'pointer' }}>
                            <input id='add_img' style={{ display: 'none' }} type="file" onChange={(e: any) => handleImageChange(e.target.files[0])} />
                            {image && <img

                                src={image.preview}
                                alt="Anh"
                                style={{ width: 100, height: 100, objectFit: 'cover' }}
                            />}
                        </label>

                    </Form.Item>
                    <Form.Item
                        {...formTailLayout}
                        name="size"
                        label="Kích thước sản phẩm"
                        rules={[{
                            required: true,
                            message: 'Vui lòng chọn kích thước sản phẩm',
                        },]}
                        hasFeedback
                    >
                        <Checkbox.Group>
                            <Row>
                                <Col>
                                    <Checkbox value="1" style={{ lineHeight: '32px' }}>
                                        Size M
                                    </Checkbox>
                                </Col>
                                <Col>
                                    <Checkbox value="2" style={{ lineHeight: '32px' }}>
                                        Size L
                                    </Checkbox>
                                </Col>
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>
                    <Form.Item
                        {...formTailLayout}
                        name="hot"
                        label="Sản phẩm nổi bật"
                    >
                        <Radio.Group defaultValue={false}>
                            <Radio value={true}>Có</Radio>
                            <Radio value={false}>Không</Radio>
                        </Radio.Group>

                    </Form.Item>
                    <Button
                        style={{ width: '200px', marginTop: '16px' }}
                        type="primary"
                        htmlType="submit"
                        disabled={confirmLoading}
                    >
                        Thêm
                    </Button>

                </Form>

            </>
        </div>

    )
}
export default AddProducts




