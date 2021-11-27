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
