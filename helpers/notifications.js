import { message, notification } from 'antd';

export const notiType = {
    success: 'success',
    info: 'info',
    warning: 'warrning',
    error: 'error',
};

function fomartError(message) {
    switch (message) {
        case 'Phone or password is incorrect': {
            return 'Số điện thoại hoặc mật khẩu không đúng !!';
        }
        case `Cannot read property 'id' of null`: {
            return 'Người dùng không tồn tại !!';
        }
        case `phone must be unique`: {
            return 'Số điện thoại đã tồn tại !!';
        }
        case `name must be a string`: {
            return 'Tên không hợp lệ !!';
        }
        case `video must be a string`: {
            return 'Video không hợp lệ !!';
        }
        case `node21 must be a string`: {
            return 'Nút 2.1: video không hợp lệ !!';
        }
        case `node22 must be a string`: {
            return 'Nút 2.2: video không hợp lệ !!';
        }
        case `node23 must be a string`: {
            return 'Nút 2.3: video không hợp lệ !!';
        }
        case `node24 must be a string`: {
            return 'Nút 2.4: video không hợp lệ !!';
        }
        case `node25 must be a string`: {
            return 'Nút 2.5: video không hợp lệ !!';
        }
        case `description must be a string`: {
            return 'Mô tả không hợp lệ !!';
        }
        case `detail must be a string`: {
            return 'Chi tiết không hợp lệ !!';
        }
        case `condition must be a string`: {
            return 'Điều kiện học không hợp lệ !!';
        }
        case `targetStudent must be a string`: {
            return 'Đối tượng học sinh không hợp lệ !!';
        }
        case `result must be a string`: {
            return 'Kết quả kì vọng không hợp lệ !!';
        }
        case `amount must be a number conforming to the specified constraints`: {
            return 'Giá không hợp lệ';
        }
        case `class must be a number conforming to the specified constraints`: {
            return 'Lớp không hợp lệ';
        }
        default: {
            return message;
        }
    }
}

function fomartMessage(message) {
    if (Array.isArray(message)) {
        return fomartError(message[0]);
    }
    return fomartError(message);
}

export function openNotification(type, title, message) {
    return notification[type]({
        message: title,
        description: fomartMessage(message),
        duration: 2,
    });
}
