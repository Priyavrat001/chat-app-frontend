import { Box, Stack, Typography } from '@mui/material';
import { Done as DoneIcon, DoneAll as DoneAllIcon } from '@mui/icons-material';
import { lightBlue } from '@mui/material/colors';
import moment from 'moment';
import PropTypes from 'prop-types';
import { memo } from 'react'
import { fileFormat } from '../../lib/features';
import RenderContent from './RenderContent';
import { motion } from "framer-motion";

const MessageComponent = ({ message, user }) => {

    const { sender, content, attachment = [], createdAt, status } = message;

    const sameSender = sender?._id === user._id;

    const timeAgo = moment(createdAt).fromNow();

    return (
        <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            whileInView={{ opacity: 1, x: 0 }}

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


            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end">
                <Typography variant="caption" color="text.secondary">
                    {timeAgo}
                </Typography>
                {sameSender && status !== "sending" && (
                    status === "delivered" || status === "read" ? (
                        <DoneAllIcon
                            aria-label={status === "read" ? "Read" : "Delivered"}
                            titleAccess={status === "read" ? "Read" : "Delivered"}
                            fontSize="small"
                            sx={{
                                fontSize: "1rem",
                                color: status === "read" ? "info.main" : "text.secondary",
                            }}
                        />
                    ) : (
                        <DoneIcon
                            aria-label="Sent"
                            titleAccess="Sent"
                            sx={{ fontSize: "1rem", color: "text.secondary" }}
                        />
                    )
                )}
            </Stack>
        </motion.div>
    )
}

MessageComponent.propTypes = {
    message: PropTypes.shape({
        sender: PropTypes.shape({
            _id: PropTypes.string,
            name: PropTypes.string,
        }),
        content: PropTypes.string,
        attachment: PropTypes.arrayOf(PropTypes.object),
        createdAt: PropTypes.string,
        status: PropTypes.string,
    }).isRequired,
    user: PropTypes.shape({
        _id: PropTypes.string,
    }).isRequired,
};

export default memo(MessageComponent)