
export const sampleChats = [{
    avatar: ["https://img.freepik.com/free-photo/man-white_1368-3544.jpg"],
    name: "Jonson powder",
    _id: "jonson",
    groupChat: false,
    members: ["1", "2"],


},
{
    avatar: ["https://img.freepik.com/free-photo/man-white_1368-3544.jpg"],
    name: "Jonson powder",
    _id: "jonson",
    groupChat: false,
    members: ["1", "2"],


},


]

export const sampleUsers = [{
    avatar: ["https://img.freepik.com/free-photo/man-white_1368-3544.jpg"],
    name: "Jonson powder",
    _id: "jonson",


},
{
    avatar: [
        "https://img.freepik.com/free-photo/man-white_1368-3544.jpg",
    ],
    name: "Jonson baby powder",
    _id: "bestpowder",


}];

export const sampleNotifications = [{
    sender: {
        avatar: ["https://img.freepik.com/free-photo/man-white_1368-3544.jpg"],
        name: "Jonson powder",
    },
    _id: "jonson",


},
{
    sender: {
        avatar: [
            "https://img.freepik.com/free-photo/man-white_1368-3544.jpg",
        ],
        name: "Jonson baby powder",
    },
    _id: "bestpowder",


}];

export const sampleMessage = [{
    attachments: [{
        public_id: "dfsf",
        url: "https://img.freepik.com/free-photo/man-white_1368-3544.jpg",

    }],
    content: "this is sample content message",
    _id: "sample content message",
    sender: {
        _id: "sender Id",
        name: "sender name"
    },
    chat: "chatId",
    createdAt: "2024-02-12T10:41:30.630Z"
},

{
    attachments: [{
        public_id: "dfsf2",
        url: "https://img.freepik.com/free-photo/man-white_1368-3544.jpg",

    }],
    content: "this is sample content message2",
    _id: "sample content message2",
    sender: {
        _id: "dfdsfsfd",
        name: "sender name2"
    },
    chat: "chatId2",
    createdAt: "2024-02-12T10:41:30.630Z"
}
];


export const dashboardData = {
    users: [
        {
            avatar: ["https://img.freepik.com/free-photo/man-white_1368-3544.jpg"],
            name: "Jonson powder",
            _id: "jonson",
            username: "jonson baby",
            friends: 40,
            groups: 23
        },
        {
            avatar: ["https://img.freepik.com/free-photo/man-white_1368-3544.jpg"],
            name: "Jonson baby powder",
            _id: "jonson baby powder",
            username: "baby powder",
            friends: 20,
            groups: 2
        },
    ],

    chats: [{
        avatar: ["https://img.freepik.com/free-photo/man-white_1368-3544.jpg"],
        name: "Jonson baby powder",
        _id: "jonson baby powder best powder",
        members: [{ _id: "1", avatar: "https://img.freepik.com/free-photo/man-white_1368-3544.jpg", _id: "2", avatar: "https://img.freepik.com/free-photo/man-white_1368-3544.jpg" }],
        groupChat: false,
        totalMembers: 2,
        totalMessages: 20,
        creator: {
            avatar: ["https://img.freepik.com/free-photo/man-white_1368-3544.jpg"],
            name: "Jonson baby powder",
        },

    }, {
        avatar: ["https://img.freepik.com/free-photo/man-white_1368-3544.jpg"],
        name: "Jonson baby powder",
        _id: "jonson baby powder",
        members: [{ _id: "3", avatar: "https://img.freepik.com/free-photo/man-white_1368-3544.jpg", _id: "4", avatar: "https://img.freepik.com/free-photo/man-white_1368-3544.jpg" }],
        groupChat: false,
        totalMembers: 2,
        totalMessages: 20,
        creator: {
            avatar: ["https://img.freepik.com/free-photo/man-white_1368-3544.jpg"],
            name: "Jonson baby powder",
        },

    }],

    messages: [{
        attachments: [{
            name: "my attachment",
            url: "https://img.freepik.com/free-photo/man-white_1368-3544.jpg"
        }],
        content: "content message 1",
        _id: "fdsfs",
        sender: {
            avatar: ["https://img.freepik.com/free-photo/man-white_1368-3544.jpg"],
            name: "chareman"
        },
        chats: "chatId",
        groupChat: false,
        createdAt: "2024-02-12T10:41:30.630Z"
    },
    {
        attachments: [{
            name: "my attachment",
            url: "https://img.freepik.com/free-photo/man-white_1368-3544.jpg"
        }],
         content: "content message 1",
        _id: "fdsf",
        sender: {
            avatar: ["https://img.freepik.com/free-photo/man-white_1368-3544.jpg"],
            name: "chareman"
        },
        chats: "chatId",
        groupChat: true,
        createdAt: "2024-02-12T10:41:30.630Z"
    },
    ]
}