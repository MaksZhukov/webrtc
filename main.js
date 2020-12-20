let inputPeerID = document.getElementById('peerID');
let yourPeerID = document.getElementById('yourPeerID');
let btnConnect = document.getElementById('btnConnect');
let inputText = document.getElementById('text');
let btnSendText = document.getElementById('btnSendText');
let chat = document.getElementById('chat');
let btnCall = document.getElementById('btnCall');
let btnAnswer = document.getElementById('btnAnswer');
let btnShareScreen = document.getElementById('btnShareScreen');
let myVideo = document.getElementById('myVideo');
let remVideo = document.getElementById('remVideo');
let btnClose = document.getElementById('btnClose');
let connection = null;
let peerCall = null;

let peer = new Peer();
peer.on('open', function (id) {
    yourPeerID.textContent = id;
});
peer.on('call', (call) => {
    peerCall = call;
    alert('Input call');
    myVideo.setAttribute('poster', 'cat.gif');
    remVideo.srcObject = null;
});

peer.on('connection', (conn) => {
    alert('connected');
    inputPeerID.value = conn.peer;
    connection = conn;
    connection.on('data', function (data) {
        let p = document.createElement('p');
        p.append(connection.peer, ' ', data);
        chat.append(p);
    });
});

btnConnect.addEventListener('click', () => {
    connection = peer.connect(inputPeerID.value);
    connection.on('open', function () {
        alert('connected');
        connection.on('data', function (data) {
            let p = document.createElement('p');
            p.append(connection.peer, ' ', data);
            chat.append(p);
        });
    });
});

btnSendText.addEventListener('click', () => {
    connection.send(inputText.value);
    let p = document.createElement('p');
    p.append('You ', inputText.value);
    chat.append(p);
});

btnCall.addEventListener('click', () => {
    remVideo.setAttribute('poster', 'cat.gif');
    navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((mediaStream) => {
            peerCall = peer.call(inputPeerID.value, mediaStream);
            peerCall.on('stream', (stream) => {
                remVideo.srcObject = stream;
                remVideo.onloadedmetadata = () => {
                    remVideo.play();
                };
            });
            peerCall.on('close', () => {
                alert('connection closed');
            });
            myVideo.srcObject = mediaStream;
            myVideo.onloadedmetadata = () => {
                myVideo.play();
            };
        });
});

btnAnswer.addEventListener('click', () => {
    navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((mediaStream) => {
            peerCall.answer(mediaStream);
            peerCall.on('close', () => {
                alert('connection closed');
            });
            myVideo.srcObject = mediaStream;
            myVideo.onloadedmetadata = () => {
                myVideo.play();
            };
            setTimeout(() => {
                remVideo.srcObject = peerCall.remoteStream;
                remVideo.onloadedmetadata = () => {
                    remVideo.play();
                };
            }, 1500);
        });
});

btnShareScreen.addEventListener('click', () => {
    navigator.mediaDevices.getDisplayMedia().then((mediaStream) => {
        peerCall = peer.call(inputPeerID.value, mediaStream);
        peerCall.on('stream', (stream) => {
            remVideo.srcObject = stream;
            remVideo.onloadedmetadata = () => {
                remVideo.play();
            };
        });
        peerCall.on('close', () => {
            alert('connection closed');
        });
        myVideo.srcObject = mediaStream;
        myVideo.onloadedmetadata = () => {
            myVideo.play();
        };
    });
});

btnClose.addEventListener('click', () => {
    peerCall.close();
});
