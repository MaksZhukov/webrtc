let inputPeerID = document.getElementById('peerID');
let yourPeerID = document.getElementById('yourPeerID');
let btnConnect = document.getElementById('btnConnect');
let inputText = document.getElementById('text');
let btnSendText = document.getElementById('btnSendText');
let chat = document.getElementById('chat');
let connection = null;

let peer = new Peer();
peer.on('open', function (id) {
    yourPeerID.textContent = id;
});

peer.on('connection', (conn) => {
    alert('connected');
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
