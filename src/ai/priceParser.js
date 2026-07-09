exports.extractMaxPrice = (message) => {

    const match = message.match(/(\d+)/);

    if(!match)
        return null;

    return Number(match[1]) * 1000000;
}