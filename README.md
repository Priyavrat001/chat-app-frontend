# Chat Application Frontend

React single-page frontend for a real-time chat application. It supports account login/registration, direct and group chats, messages and attachments, friend requests, notifications, and an admin dashboard. The frontend communicates with the companion Express/Socket.IO backend in `../chat-app-backend`.

> This guide intentionally contains no account credentials, admin keys, tokens, or deployment secrets. Frontend environment values are public once bundled; never put secrets in them.

## Contents

- [Technology](#technology)
- [Requirements and setup](#requirements-and-setup)
- [Environment configuration](#environment-configuration)
- [Commands](#commands)
- [Application structure](#application-structure)
- [Routes and access](#routes-and-access)
- [State and data flow](#state-and-data-flow)
- [HTTP API usage](#http-api-usage)
- [Audio calling](#audio-calling)
- [Socket events](#socket-events)
- [Development and debugging](#development-and-debugging)
- [Current limitations](#current-limitations)
- [Deployment notes](#deployment-notes)

## Technology

- React 18, React DOM, and Vite 5 with the SWC React plugin.
- React Router for client-side routes and lazy-loaded pages.
- Material UI, Emotion, and Material icons for the interface.
- Redux Toolkit, React Redux, and RTK Query for shared state and HTTP data.
- Axios for login, profile checks, logout, and admin requests.
- Socket.IO client for chat, typing, presence, and notification events.
- `6pp` for input/file helpers and infinite-scroll behavior.
- Framer Motion for selected interface animations; Moment.js for dates.
- Chart.js and `react-chartjs-2` for admin charts; `react-hot-toast` for feedback.
- `react-helmet-async` for document title metadata; `uuid` for client-generated IDs.

## Requirements and setup

Use Node.js 20 or a compatible current Node.js release and npm. The Dockerfile uses Node.js 20.

From this directory:

```sh
npm ci
```

Create `.env.local` as described below, then start the frontend:

```sh
npm run dev
```

Vite normally serves the app at `http://localhost:5173`. The backend must be running and reachable at the configured URL. Authentication requests use cookies, so the backend must allow credentialed requests from the frontend origin.

## Environment configuration

`src/constants/config.js` reads `VITE_SERVER` from Vite's environment and uses it as the HTTP API base URL. The backend mounts its routes under `/api/v1`; for a local backend using port 4000, `.env.local` can contain:

```dotenv
VITE_SERVER=http://localhost:4000/api/v1
```

Restart Vite after changing environment files. The existing `sample.env` is a placeholder, not a complete working configuration. `.env` and `*.local` files are ignored by Git; check `.gitignore` before adding other environment filenames.

Do not put passwords, private keys, admin secrets, or other credentials in `VITE_*` variables. Vite embeds these values into browser-delivered code.

**Socket URL:** `src/socket.jsx` currently connects directly to `http://localhost:4000`. Although `sample.env` and `src/constants/config.js` refer to `SOCKET_SERVER`, the provider does not use that value. A hosted frontend therefore needs a code/configuration change before its socket connection can target a hosted backend. Vite exposes client variables by default only when their names start with `VITE_`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install the exact dependency versions in `package-lock.json`. |
| `npm run dev` | Start the Vite development server with hot reload. |
| `npm run build` | Create the production bundle in `dist/`. |
| `npm run preview` | Serve the most recent `dist/` build locally. Run `npm run build` first. |
| `npm run lint` | Run ESLint over JavaScript and JSX files. |

There is no test script configured in `package.json` at this time.

## Application structure

```text
src/
  App.jsx                     Route definitions, profile bootstrap, lazy page loading
  main.jsx                    React, Redux, MUI baseline, and Helmet entry point
  socket.jsx                  Socket.IO context/provider and socket hook
  assets/                     Frontend assets and notes
  components/
    auth/                     Route access wrapper
    dialogs/                  File, group, and chat action dialogs/menus
    layouts/                  Main chat layout, headers, loaders, admin layout
    shared/                   Reusable chat, message, attachment, avatar, and user UI
    specifics/                Chat list, search, groups, notifications, profile
    styles/                   Shared styled inputs, links, buttons, and loaders
  constants/                  API configuration, event names, colors, route/sample data
  hooks/                      API error/mutation and socket-event hooks
  lib/                        Image, file, date, and storage helpers
  pages/                      Main application pages
    admin/                    Admin login, dashboard, and management tables
  redux/
    api/                      RTK Query endpoint definitions
    reducers/                 Authentication, chat, and miscellaneous UI state
    thunks/                   Admin authentication requests
  utils/                      Form validation helpers
```

### Main modules

| Location | Responsibility |
| --- | --- |
| `src/App.jsx` | On startup, requests `/user/myprofile`, stores the current user, configures routes, and lazy-loads page components. The authenticated route tree is wrapped in `SocketProvider` and `ProtectRoute`. |
| `src/main.jsx` | Mounts React under `StrictMode`, Redux `Provider`, `HelmetProvider`, and MUI `CssBaseline`. |
| `src/components/layouts/AppLayout.jsx` | Shared user-app shell: top navigation, responsive chat list, profile panel, delete menu, online-user events, unread alerts, and chat-list refresh. |
| `src/pages/Chat.jsx` | Loads chat details/history, displays `ChatHeader` and messages, joins/leaves chats, sends messages, and handles typing/message socket events. |
| `src/pages/Group.jsx` | Lists and manages groups, loads group members, and presents rename, add-member, remove-member, and delete flows. |
| `src/redux/api/api.js` | RTK Query base URL, HTTP endpoints, credentials, cache tags, and generated hooks. |
| `src/redux/store.js` | Combines `auth`, `misc`, `chat`, and RTK Query reducers and middleware. |
| `src/hooks/hook.jsx` | `useErrors` displays API errors, `useAsyncMution` wraps mutations with loading/toast state, and `useSocketEvent` subscribes/unsubscribes socket handlers. |
| `src/constants/event.js` | Shared event-name strings used by chat and notifications. `events.js` currently duplicates these constants. |
| `src/lib/features.js` | File-type selection, image passthrough, date labels, and local-storage helper. See [Current limitations](#current-limitations). |
| `src/components/styles/StyledComponents.jsx` | Reusable styled inputs, links, buttons, and bouncing skeletons. |

Other component groups:

- `components/layouts/`: `Header.jsx` provides search, group creation/management, notifications, and logout. `ChatHeader.jsx` displays conversation identity and call icons. `Loaders.jsx` supplies layout and typing placeholders. `layouts/admin/AdminLayout.jsx` provides the admin sidebar and access check.
- `components/dialogs/`: `FileMenu.jsx` uploads attachments; `DeleteChatMenu.jsx` offers chat deletion/group leaving; `ConfirmDeleteDialog.jsx` confirms destructive actions; `AddMemberDialog.jsx` is the group-add UI (currently incomplete; see below).
- `components/shared/`: `ChatItem.jsx`, `ChatList`-related rows, `MessageComponent.jsx`, attachment/content renderers, avatar and user rows, and the page-title helper. `shared/admin/Table.jsx` wraps MUI Data Grid.
- `components/specifics/`: `ChatList.jsx`, `Search.jsx`, `Notifications.jsx`, `NewGroups.jsx`, and `Profile.jsx` implement the main app workflows. `specifics/admin/Charts.jsx` contains dashboard charts.
- `pages/admin/`: `AdminLogin.jsx` verifies the admin session; `Dashboard.jsx` displays counts/charts; `UserManagement.jsx`, `ChatManagement.jsx`, and `MessageMangement.jsx` render admin data tables.
- `constants/sampleData.js` contains fixtures, not live API data. `constants/color.js` holds shared palette values. `constants/route.js` exports a small admin tab definition; `App.jsx` is the actual route registry.

## Routes and access

| Path | Page | Access/behavior |
| --- | --- | --- |
| `/` | Home | Authenticated; shows the chat workspace and prompts the user to select a conversation. |
| `/about` | About | Authenticated; currently a minimal placeholder page. |
| `/chat/:id` | Chat | Authenticated; loads the selected conversation. |
| `/groups?group=:id` | Group | Authenticated; group selection is encoded in the `group` query parameter. |
| `/login` | Login | Redirects authenticated users to `/`; contains login and registration forms. |
| `/admin` | Admin login | Separate admin-key verification flow. The key is supplied by the backend configuration and is not documented here. |
| `/admin/dashboard` | Admin dashboard | Requires the Redux admin session. |
| `/admin/users` | User management | Requires the Redux admin session. |
| `/admin/chats` | Chat management | Requires the Redux admin session. |
| `/admin/messages` | Message management | Requires the Redux admin session. |
| `*` | Not Found | Fallback for unknown paths. |

User routes are protected by `ProtectRoute` and wrapped by the socket provider. The admin layout separately checks `auth.isAdmin`. On reload, `App.jsx` checks the user session through `/user/myprofile`; the backend cookie and credentialed CORS setup are part of this flow.

## State and data flow

- `auth`: logged-in `user`, `isAdmin`, and the initial profile `loader` flag.
- `misc`: dialog/menu flags, responsive drawer state, upload state, and selected chat deletion metadata.
- `chat`: notification count and unread-message alerts keyed by chat ID.
- `api`: RTK Query cache for chat, user, group, and message HTTP requests.

RTK Query requests use `credentials: "include"`. Login, registration, profile checks, logout, and admin requests use Axios with `withCredentials: true`. If requests work in a REST client but fail in the browser, inspect the browser's Network tab, the cookie domain/same-site settings, and backend CORS credentials/origin settings.

Chat history is requested in pages; `6pp`'s `useInfiniteScrollTop` loads earlier pages as the message list is scrolled upward. Newly received messages are appended from socket events. Typing state is emitted while the composer changes and expires after a short timeout.

## HTTP API usage

`VITE_SERVER` is the base URL; the following relative paths are defined in `src/redux/api/api.js` unless noted otherwise. The backend API prefix is `/api/v1`.

| Method | Relative path | Frontend use |
| --- | --- | --- |
| GET | `chat/my` | Current user's chat list. |
| GET | `chat/:chatId` | Chat details; optional `?populate=true` returns member profiles. |
| GET | `chat/message/:chatId?page=:page` | Paginated message history. |
| POST | `chat/message` | Upload message attachments using `FormData`. |
| GET | `chat/my/groups` | Groups available in the group-management page. |
| GET | `user/search?name=:name` | User search. |
| GET | `user/friends?chatId=:chatId` | Friends available for group workflows. |
| GET | `user/notification` | Pending friend requests. |
| PUT | `user/sendrequest` | Send a friend request. |
| PUT | `user/acceptrequest` | Accept or reject a friend request. |
| POST | `chat/new` | Create a group. |
| PUT | `chat/:chatId` | Rename a group. |
| PUT | `chat/addmembers` | Add group members. |
| PUT | `chat/removemember` | Remove a group member. |
| DELETE | `chat/:chatId` | Delete a chat/group. |
| DELETE | `chat/leave/:chatId` | Leave a group. |

Additional Axios requests include `user/myprofile`, `user/login`, `user/new`, `user/logout`, `admin/verify`, `admin/`, `admin/logout`, and admin reporting endpoints (`admin/stats`, `admin/users`, `admin/chats`, `admin/messages`). Their requests are implemented in `App.jsx`, `Login.jsx`, `Header.jsx`, admin thunks, and admin pages.

## Audio calling

Audio calling is implemented in `ChatHeader.jsx`, `IncomingCallDialog.jsx`, and `AudioCall.jsx`. The backend relays call invitations and WebRTC signaling through the authenticated Socket.IO connection; audio media itself is peer-to-peer through the browser's WebRTC APIs.

### Call lifecycle

1. In a direct chat, the caller clicks the phone icon in `ChatHeader`. The frontend requests microphone access with `navigator.mediaDevices.getUserMedia({ audio: true })` before sending the invitation. The browser prompts for permission if needed. If permission is denied or unavailable, the current handler does not show an in-app error message.
2. The caller selects the other member from `chat.members`, emits `USER_AUDIO_CALL` with `{ chatId, userId, calledId }`, and creates an outgoing-call session containing both participant IDs, the chat ID, the participant, and the local audio stream.
3. The backend forwards `USER_AUDIO_CALL` to the recipient as `{ callerInfo, chatId }`. The recipient sees `IncomingCallDialog` with accept and reject controls.
4. Accepting emits `ACCEPT_AUDIO_CALL` with `{ callerId, chatId }`. The callee opens `AudioCall`; the caller receives the acceptance event and opens the same component with `startCall=true`.
5. The caller creates an `RTCPeerConnection`, adds local microphone tracks, creates an SDP offer, and emits `NEW_AUDIO_CALL_OFFER` with `{ callerId, calledId, chatId, offer }`.
6. The callee receives the offer, requests microphone access, adds local tracks, applies the remote offer, creates an SDP answer, and emits `NEW_AUDIO_CALL_ANSWER` with `{ callerId, calledId, chatId, answer }`. The caller applies that answer.
7. Both peers send ICE candidates using `ICE_CANDIDATE`. When remote audio tracks arrive, the component assigns the stream to its hidden `<audio autoPlay>` element. Connection state and incoming tracks drive the connected status and call timer.
8. Either participant can end the call. `END_AUDIO_CALL` is sent through Socket.IO; both sides close the peer connection, stop local media tracks, clear remote audio, and close the call UI.

### Call UI and controls

- The incoming dialog displays the caller's name/avatar and offers accept/reject buttons.
- The call dialog shows the other participant, a `Calling...` or `Connecting...` status, and elapsed time after a connection is detected.
- The microphone control toggles each local audio track's `enabled` property. It does not acquire a new stream.
- The speaker control sets the remote audio element's volume to `0` or `1`; it does not select a physical output device.
- The end control stops local tracks and closes the `RTCPeerConnection`. The component also attempts this cleanup when it unmounts.

### Signaling event names

| Event | Payload | Use |
| --- | --- | --- |
| `USER_AUDIO_CALL` (`NEW_AUDIO_CALL_ALERT`) | Caller to server: `{ chatId, userId, calledId }`. Server to callee: `{ callerInfo, chatId }`. | Ring the other participant and show the incoming call dialog. The string constant is in `src/constants/events.js`. |
| `ACCEPT_AUDIO_CALL` | `{ callerId, chatId }` | Callee tells the backend to notify the caller that the call was accepted. |
| `NEW_AUDIO_CALL_OFFER` | `{ callerId, calledId, chatId, offer }` | Caller sends the WebRTC session offer to the callee. |
| `NEW_AUDIO_CALL_ANSWER` | `{ callerId, calledId, chatId, answer }` | Callee returns its WebRTC session answer to the caller. |
| `ICE_CANDIDATE` | `{ callerId, calledId, chatId, candidate }` | Relays connectivity candidates between peers. |
| `END_AUDIO_CALL` | `{ callerId, calledId, chatId }` | Notifies the other participant that the call ended. |

`ACCEPT_AUDIO_CALL`, offer/answer, ICE, and end-call constants are in `src/constants/event.js`; the call invitation string is separately defined in `src/constants/events.js`. Keep these values identical to the backend constants when changing signaling. `ChatHeader` owns incoming/outgoing/active call state, while `AudioCall` owns peer-connection state and media cleanup.

### Requirements and current boundaries

- The browser must support `RTCPeerConnection`, `getUserMedia`, and autoplaying remote audio. Microphone access requires user permission and a secure context (HTTPS, or localhost during local development).
- The peer connection currently uses only Google's public STUN server (`stun:stun.l.google.com:19302`). There is no TURN server configuration, so peers behind restrictive NAT/firewall combinations may fail to connect even when signaling succeeds.
- Only one-to-one audio calling is implemented. The video icon's handler is empty; there is no video-call implementation.
- Rejecting an incoming call only closes the recipient's dialog. There is no reject-call socket event or caller notification, so the caller can remain in `Calling...` until they end their call.
- There is no ringing timeout or explicit busy/offline response. The backend silently skips delivery if the called user's socket is not connected.
- ICE candidates are applied immediately; there is no candidate queue for candidates received before a peer connection/remote description is ready. Network timing can therefore affect some calls.
- Call events use the active chat ID to filter offers, answers, ICE candidates, and end notifications. The backend's socket registry currently maps one socket per user, which limits multi-tab/device call delivery; see the backend README for server-side constraints.

For end-to-end troubleshooting, verify both users are authenticated and connected to the same backend Socket.IO server, microphone permission is granted in both browsers, the call-event strings match between frontend and backend, and the browser console has no WebRTC or media-permission errors.

## Socket events

The event strings are defined in `src/constants/event.js` and mirrored by the backend.

| Event | Frontend behavior |
| --- | --- |
| `CHAT_JOINED`, `CHAT_LEAVED` | Notify the backend when opening/closing the active chat; backend updates presence. |
| `NEW_MESSAGE` | Send a message and receive new messages for the active chat. |
| `START_TYPING`, `STOP_TYPING` | Publish and display typing indicators. |
| `ONLINE_USERS` | Update online indicators in the chat list. |
| `NEW_MESSAGE_ALERT` | Increment unread counts for chats other than the active chat. |
| `NEW_REQUEST` | Increment the friend-request notification count. |
| `REFETCH_CHATS` | Refresh the chat list after relevant changes. |
| `ALERT` | Display server notices in the active message stream. |
| `USER_AUDIO_CALL`, `ACCEPT_AUDIO_CALL`, `NEW_AUDIO_CALL_OFFER`, `NEW_AUDIO_CALL_ANSWER`, `ICE_CANDIDATE`, `END_AUDIO_CALL` | Incoming calls, WebRTC offer/answer/ICE signaling, and call teardown. See [Audio calling](#audio-calling) for payloads and call order. |
| `NEW_ATTACHMENT` | Declared as an event name; attachment upload currently uses the HTTP mutation. |

`AppLayout.jsx` subscribes to global chat-list/presence events. `Chat.jsx` subscribes to active-chat messages, typing events, and alerts. `useSocketEvent` removes listeners when the component effect is cleaned up.

## Development and debugging

1. **Blank page or loading screen:** check the browser console and the `/user/myprofile` request. A failed profile request intentionally clears the user session and can send the browser to `/login`.
2. **HTTP requests fail:** confirm `.env.local` has the backend API base including `/api/v1`, restart Vite, and inspect the request URL/status in DevTools. Check backend CORS and credentialed-cookie configuration.
3. **Socket events do not arrive:** the current socket provider targets `http://localhost:4000` regardless of `SOCKET_SERVER`. Verify that URL is reachable from the browser and that the backend accepts the session cookie.
4. **Messages do not appear:** check both the `chat/message/:id` history request and socket events. A new message is emitted over Socket.IO; attachments use the `chat/message` HTTP endpoint.
5. **Attachment behavior:** `FileMenu.jsx` accepts up to five files per selection and sends them as repeated `files` fields plus `chatId`. The backend must be configured for its upload/storage integration.
6. **Admin page redirects:** confirm the admin verification/session request succeeds; `AdminLayout` redirects when `auth.isAdmin` is false.
7. **Changes do not refresh lists:** inspect RTK Query `providesTags`/`invalidatesTags` in `src/redux/api/api.js` and the relevant component's query lifecycle.
8. **Run checks:** `npm run build` validates the production bundle; `npm run lint` reports ESLint findings. No automated test command is currently configured.

## Current limitations

These are code-level observations to help set expectations; they are not configuration instructions:

- Audio calling uses WebRTC signaling and peer-to-peer audio as described in [Audio calling](#audio-calling). Video calling is not implemented; the video icon handler is empty.
- The socket provider hard-codes `http://localhost:4000`; the exported `socket_sever` value is not used, and `SOCKET_SERVER` is not a Vite-exposed variable as named in `sample.env`.
- `geOrSaveFromStorage` in `src/lib/features.js` has its local-storage reads/writes commented out, so unread-alert persistence is not implemented despite its call sites.
- Group member addition is incomplete: `AddMemberDialog.jsx` uses fixture users and has no add-member mutation wired into its submit handler. Also, `misc` defines `isAddMembers`, while `Group.jsx` checks `isAddMember`, so the dialog visibility flag does not match.
- The `newGroup` mutation invalidates the `Chats` tag while the API declares `Chat`; verify/refetch behavior after group creation if the existing chat list looks stale.
- `fileFormat` in `src/lib/features.js` classifies extensions by string checks; its current video checks precede the audio checks, and common audio extensions such as `.mp3`/`.wav` are not explicitly classified.
- `About.jsx` is placeholder content. The HTML document title and favicon in `index.html` are still the Vite defaults.

## Deployment notes

- `npm run build` outputs static files to `dist/`. Configure the host to serve `index.html` for unknown paths so React Router routes load directly. `vercel.json` already rewrites requests to `/index.html`.
- `npm run preview` is a local preview server, not a production hosting service.
- The frontend `Dockerfile` installs dependencies, exposes port 5173, and starts the Vite development server with `--host`; it is a development container, not a static production image.
- The repository-level `compose.yml` starts MongoDB, backend, and frontend together. It expects private backend and frontend `.env` files; supply them locally and do not commit them. The browser-facing frontend still uses the socket URL described above.

## Security notes

- Never add working credentials, admin keys, session cookies, API tokens, or private deployment values to this README, source code, or a committed environment file.
- Values prefixed with `VITE_` are public browser configuration. Only put non-secret URLs or other intentionally public values there.
- The backend is responsible for authentication and authorization. Hiding an admin route in the UI is not a security boundary; the backend must enforce admin access for every protected endpoint.