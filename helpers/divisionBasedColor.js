module.exports = {

    default: {

        panel: 'style="background: #c57634d1 !important;"',
        background: 'style="border-color: #c57634 !important; background-color: #3483c5 !important;"'
    },

    divisionBasedColor(division) {
        let switchDivision = division.split(" ")[0]
        let panel = 'style="background: #ff0000a1 !important;"';
        let background = 'style="border-color: #ff0000 !important; background-color: #0000ff !important;"';
        switch (switchDivision) {
            case "Bronze":
                panel = 'style="background: #c57634d1 !important;"';
                background = 'style="border-color: #c57634 !important; background-color: #3483c5 !important;"';
                break;
            case "Silver":
                panel = 'style="background: #b3b3b3d1 !important;"';
                background = 'style="border-color: #b3b3b3 !important; background-color: #444444 !important;"';
                break;
            case "Gold":
                panel = 'style="background: #FFD063d1 !important;"';
                background = 'style="border-color: #FFD063 !important; background-color: #6392ff !important;"';
                break;
            case "Platinum":
                panel = 'style="background: #958799d1 !important;"';
                background = 'style="border-color: #958799 !important; background-color: #8b9987 !important;"';
                break;
            case "Diamond":
                panel = 'style="background: #6eb6ffd1 !important;"';
                background = 'style="border-color: #6eb6ff !important; background-color: #ffb76e !important;"';
                break;
            case "Master":
                panel = 'style="background: #c9795ed1 !important;"';
                background = 'style="border-color: #c9795e !important; background-color: #5eaec9 !important;"';
                break;
        }

        return {panel, background, switchDivision}
    }
}