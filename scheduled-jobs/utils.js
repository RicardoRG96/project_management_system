createArrayOfRows = (row) => {
    const keys = Object.keys(row);
    const values = keys.map(key => row[key]);
    return values;
}

exports.formatRows = (rows) => {
    let totalRows = [];
    rows.forEach(row => {
        totalRows.push(this.createArrayOfRows(row))
    });
    return totalRows;
}