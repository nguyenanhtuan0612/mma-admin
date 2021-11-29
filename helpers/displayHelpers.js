function checkNull(string) {
    if (string) {
        return string;
    }
    return '...';
}

function avatarUser(avatarImage) {
    if (avatarImage) {
        return avatarImage;
    }
    return '/img/avatar.jpeg';
}

function getDate(createdAt) {
    if (createdAt) {
        const splitT = createdAt.split('T');
        const spiltDash = splitT[0].split('-');
        return spiltDash[2] + '/' + spiltDash[1] + '/' + spiltDash[0];
    }
    return '...';
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
    avatarUser,
    checkNull,
};
