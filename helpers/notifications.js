import { message, notification } from 'antd';

export const notiType = {
    success: 'success',
    info: 'info',
    warning: 'warrning',
    error: 'error',
};

function fomartError(string) {
    switch (string) {
        case 'Phone or password is incorrect': {
            return 'Số điện thoại hoặc mật khẩu không đúng !!';
        }
        case `Cannot read property 'id' of undefined`:
        case `Cannot read property 'id' of null`: {
            return 'Người dùng không tồn tại !!';
        }
        case `phone must be unique`: {
            return 'Số điện thoại đã tồn tại !!';
        }
        default: {
            return string;
        }
    }
}

export function openNotification(type, title, message) {
    return notification[type]({
        message: title,
        description: fomartError(message),
        duration: 2,
    });
}
