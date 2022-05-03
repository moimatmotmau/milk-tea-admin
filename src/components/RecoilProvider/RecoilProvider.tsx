import { atom } from 'recoil';

export const initialValues: any = {
    username: '',
    password: '',
    email: '',
    phone: '',
    fullName: '',
    age: '',
    avatar: '',
    address: '',
    cart: [],
    orders: [],
    _id: '',
}

if (!localStorage.getItem('account')) {
    localStorage.setItem('account', JSON.stringify(initialValues))
}

const data: any = localStorage.getItem('account');

export const accountState = atom({
    key: 'accountAdmin',
    default: JSON.parse(data)
})