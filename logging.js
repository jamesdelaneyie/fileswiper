export const log = (message, type) => {
    let messageStyle = '';
    if(type === 'interacting') {
        messageStyle = 'background: #222; color: #bada55'
    } else if(type === 'moving') {
        messageStyle = 'background: #222; color: #ff0000'
    } else {
        messageStyle = '';
    }
    console.log(`%c${message}`, messageStyle);
}