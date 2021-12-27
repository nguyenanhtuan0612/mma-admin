function checkNull(string, nullReturn = '...') {
    if (string) {
        return string;
    }
    return nullReturn;
}

function avatarImg(avatarImage, nullReturn = '/img/avatar.jpeg') {
    if (avatarImage) {
        return avatarImage;
    }
    return nullReturn;
}

function formatCurrency(money) {
    if (money) {
        return money.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
    }
    return null;
}

function getDate(createdAt) {
    if (createdAt) {
        const splitT = createdAt.split('T');
        const spiltDash = splitT[0].split('-');
        return spiltDash[2] + '/' + spiltDash[1] + '/' + spiltDash[0];
    }
    return '...';
}

function dateFormat(createdAt) {
    if (createdAt && createdAt != '') {
        const splitT = createdAt.toString().split('T');
        return splitT[0];
    }
    return '';
}

function limitLength(value) {
    if (!value) return '...';
    if (value.length > 30) {
        return value.slice(0,30);
    }
    return value;
}

function checkSelect(value) {
    if (value) {
        return value;
    }
    return '';
}

function isActive(active, reverse = false) {
    let className = 'fas fa-check-circle text-emerald-500 ';
    let status = 'Hoạt động';
    if (active == false) {
        className = 'fas fa-times-circle text-red-500 ';
        status = 'Đã vô hiệu';
    }
    if (reverse === true) {
        return (
            <>
                {status} <i className={className + 'ml-2'}></i>
            </>
        );
    }
    return (
        <>
            <i className={className + 'mr-2'}></i> {status}
        </>
    );
}

export default {
    isActive,
    getDate,
    avatarImg,
    checkNull,
    limitLength,
    dateFormat,
    checkSelect,
    formatCurrency,
};
