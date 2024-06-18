export function verifyURL(url) {
    const pattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+)(\.[a-zA-Z]{2,})(:[0-9]{1,5})?(\/[^\s]*)?$/;
    return pattern.test(url.trim());
}

export function verifyEventName(name) {
    const pattern = /^[\s|\S]{5,40}$/
    return pattern.test(name.trim());
}

export function verifyEventDescription(description) {
    const pattern = /^[\s|\S]{500,1500}$/
    return pattern.test(description.trim());
}

export function verifyDateStart(dateStart) {
    const today = new Date().getTime();
    const startTime = new Date(dateStart).getTime();

    return startTime > today;
}

export function verifyDateEnd(dateStart, dateEnd) {
    const startTime = new Date(dateStart).getTime();
    const endTime = new Date(dateEnd).getTime();

    return endTime > startTime;
}

export function verifyDates(dateStart, dateEnd) {
    const today = new Date().getTime();
    const startTime = new Date(dateStart).getTime();
    const endTime = new Date(dateEnd).getTime();

    const isStartTimeAfterToday = startTime > today;
    const isEndTimeAfterStart = endTime > startTime;

    console.log('Data de início é maior que hoje? ', isStartTimeAfterToday);
    console.log('Data fim é maior que a data início? ', isEndTimeAfterStart);

    return {data_inicio: isStartTimeAfterToday, data_fim: isEndTimeAfterStart }
}