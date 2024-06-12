module.exports = {
    dateParse: (createdAt) => {
        const parsedDate = new Date(createdAt);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        const formattedDate = parsedDate.toLocaleString('en-US', options);
        return formattedDate;
    }
}