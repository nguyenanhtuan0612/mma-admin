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
    const splitT = createdAt.split('T');
    const spiltDash = splitT[0].split('-');
    return spiltDash[2] + '/' + spiltDash[1] + '/' + spiltDash[0];
}

function isActive(active) {
    let className = 'fas fa-check-circle text-emerald-500 mr-2';
    let status = 'Hoạt động';
    if (active == false) {
        className = 'fas fa-times-circle text-red-500 mr-2';
        status = 'Đã vô hiệu';
    }
    return (
        <>
            <i className={className}></i> {status}
        </>
    );
}

export default {
    isActive,
    getDate,
    avatarUser,
    checkNull,
};
