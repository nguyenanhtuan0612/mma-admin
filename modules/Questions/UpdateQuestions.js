import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from 'layouts/Admin';
import { loadingFalse, loadingTrue } from 'store/actions';
import { useRouter } from 'next/router';
import { notiType, openNotification, serviceHelpers } from 'helpers';
import UpdateMatching from './UpdateMatching';
import UpdateDrag from './UpdateDrag';
import UpdateMultipleChoice from './UpdateMultipleChoice';
import UpdateOrder from './UpdateOrder';

export default function UpdateQuestions() {
    const [load, dispatch] = useContext(AuthContext);
    const router = useRouter();
    const { id } = router.query;
    const [question, setQuestion] = useState({ type: null, lessonId: null });

    useEffect(async () => {
        dispatch(loadingTrue());
        const qs = await getDetailLesson();
        console.log(qs);
        setQuestion(qs);
        dispatch(loadingFalse());
    }, []);

    async function getDetailLesson() {
        const rs = await serviceHelpers.detailData('questions', id);
        if (!rs) return openNotification(notiType.error, 'Lỗi hệ thống');
        const data = rs;
        if (data.statusCode === 400) return openNotification(notiType.error, 'Lỗi hệ thống', data.message);

        if (data.statusCode <= 404 && data.statusCode >= 401) {
            router.push('/auth/login');
            return <div></div>;
        }
        return data.data.data;
    }

    function render() {
        switch (question.type) {
            case 'matching': {
                return <UpdateMatching lessonId={question.lessonId} data={question} />;
            }
            case 'drag': {
                return <UpdateDrag data={question} lessonId={question.lessonId} />;
            }
            case 'multiChoice': {
                return <UpdateMultipleChoice data={question} lessonId={question.lessonId} />;
            }
            case 'order': {
                return <UpdateOrder data={question} lessonId={question.lessonId} />;
            }
            default: {
                return 'Không tìm thấy câu hỏi !!';
            }
        }
    }

    return question.type ? render() : null;
}
