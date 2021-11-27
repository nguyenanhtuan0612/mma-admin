import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

/*
interface BreadCrumb {
  route: string;
  label: string;
  link: string;
}
*/

const Route2LabelMap = {
    '/': 'Trang Chủ',
    '/users': 'Quản lý người dùng',
    '/users/[id]': 'Chi tiết người dùng',
};

export function BreadCrumbs() {
    const router = useRouter();
    const [crumbs, setCrumbs] = React.useState([]);

    React.useEffect(() => {
        console.log(router.pathname);
        const segmentsPath = router.asPath.split('/');
        const segmentsRoute = router.route.split('/');
        const crumbLinks = CombineAccumulatively(segmentsPath);
        const crumbLabels = CombineAccumulatively(segmentsRoute);

        if (crumbLinks[0] == '/' && crumbLinks[1] == '/') {
            crumbLinks.pop();
            crumbLabels.pop();
        }

        const crumbs = crumbLinks.map((link, index) => {
            const route = crumbLabels[index];
            const crumb = {
                link: link,
                route: route,
                label: Route2LabelMap[route] || route,
            };
            return crumb;
        });
        setCrumbs(crumbs);

        console.log({
            router,
            segmentsPath,
            segmentsRoute,
            crumbLinks,
            crumbLabels,
            crumbs,
        });
    }, [router.route]);

    return (
        <div className="w-full flex gap-1 text-white">
            {crumbs.map((c, i) => {
                return (
                    <div className="flex items-center gap-1 font-semibold text-white text-sm uppercase" key={i}>
                        {i > 0 ? <div>{'>'}</div> : null}
                        <div className=" px-2 py-1 rounded-xl">
                            <Link href={c.link} className="text-white">
                                {c.label}
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function CombineAccumulatively(segments) {
    /* 
  when segments = ['1','2','3']
  returns ['1','1/2','1/2/3']
  */
    const links = segments.reduce((acc, cur, curIndex) => {
        const last = curIndex > 1 ? acc[curIndex - 1] : '';
        const newPath = last + '/' + cur;
        acc.push(newPath);
        return acc;
    }, []);
    return links;
}