import { Box, Typography } from '@mui/material';
import { lightBlue } from '@mui/material/colors';
import moment from 'moment';
import React, { memo } from 'react'
import { fileFormat } from '../../lib/features';
import RenderContent from './RenderContent';
import { motion } from "framer-motion";

const MessageComponent = ({ message, user }) => {

    const { sender, content, attachment = [], createdAt } = message;

    const sameSender = sender?._id === user._id;

    const timeAgo = moment(createdAt).fromNow();

    return (
        <div
            // initial={{opacity:0, x:"-100%"}}
            // animate={{opacity:0, x:0}}

            style={{
                alignSelf: sameSender ? "flex-end" : "flex-start",
                backgroundColor: "white",
                color: "black",
                borderRadius: "5px",
                padding: "0.5rem",
                width: "fit-content"
            }}
        >{
                !sameSender && <Typography color={lightBlue} fontWeight={"600"} variant='caption'>{sender.name}</Typography>
            }
            {
                content && <Typography>{content}</Typography>
            }
            {
                attachment.length > 0 && attachment.map((attachItem, index) => {
                    const url = attachItem.url;
                    const file = fileFormat(url);
                    return <Box key={index}>
                        <a href={url} target='_blank' download style={{
                            color: "black"
                        }}>
                            {RenderContent(file, url)}
                        </a>
                    </Box>
                })
            }


            <Typography variant="caption" color="text.secondary">
                {timeAgo}
            </Typography>
        </div>
    )
}

export default memo(MessageComponent)