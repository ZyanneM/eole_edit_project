import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';

type Props = {
    title?: string;
    content: string;
    type?: "success" | "danger" | "primary";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Toast = ({title, content, type = "success"}: Props) => {
    return (
        <div className={`btn btn-${type} bounce-in-top`}>
            {title && (
                <p>
                    <strong>{title}</strong>
                </p>
            )}
            <p>{content}</p>
        </div>
    );
}

export default Toast;