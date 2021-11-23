import { useState } from 'react';

/**
 * # MY ACCOUNT GOOGLE PLAY:
 * @see {@link https://play.google.com/store/apps/developer?id=dzino Google Play}
 */

export default function PrivatePage(props) {
    const [image, setImage] = useState(null);
    const [createObjectURL, setCreateObjectURL] = useState(null);

    const uploadToClient = event => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];

            setImage(i);
            setCreateObjectURL(URL.createObjectURL(i));
        }
    };

    const uploadToServer = async event => {
        const body = new FormData();
        body.append('file', image);
        const response = await fetch('/api/file', {
            method: 'POST',
            body,
        });
    };

    return (
        <div class="col-md-12">
            <form method="post" action="http://localhost:4420/api/v1/upload" enctype="multipart/form-data">
                <div class="form-group row">
                    <label class="col-md-2" for="exampleInputFile">
                        File báo cáo:
                    </label>
                    <input class="col-md-10" type="file" id="exampleInputFile" name="rp_files" />
                </div>

                <div class="row row_btn">
                    <div class="col-md-6 col_btn">
                        <button type="submit" class="btn btn-primary btn-block btn-flat btn_login">
                            Thêm báo cáo
                        </button>
                    </div>
                    <div class="col-md-6 col_btn">
                        <a href="/reports" class="btn btn-primary btn-block btn-flat btn_login">
                            Hủy
                        </a>
                    </div>
                </div>
            </form>
        </div>
    );
}
