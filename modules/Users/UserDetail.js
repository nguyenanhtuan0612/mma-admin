import React, { useState } from 'react';
import { Tabs } from 'antd';
import DetailUser from './components/DetailUser';

const { TabPane } = Tabs;

export default function UserDetail() {
    const [avatar, setAvatar] = useState('/img/avatar.jpeg');
    const [fullName, setFullName] = useState('...');

    function callback(key) {
        console.log(key);
    }

    return (
        <>
            <div className="border-2">
                <div className={'relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-t bg-blueGray-100'}>
                    <div className=" px-6 align-middle text-sm whitespace-nowrap p-4 text-center flex items-center justify-center">
                        <img src={avatar} className="h-24 w-24 bg-white rounded-full border mr-4" alt="..."></img>{' '}
                        <h3 className="text-4xl font-semibold leading-normal text-blueGray-700">{fullName}</h3>
                    </div>
                </div>
                <div className={'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg bg-white px-6'}>
                    <Tabs defaultActiveKey="1" onChange={callback} className="text-xl" size="middle" tabBarStyle={{ fontWeight: 500 }}>
                        <TabPane tab="Thông tin cá nhân" key="1">
                            <DetailUser />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </>
    );
}
