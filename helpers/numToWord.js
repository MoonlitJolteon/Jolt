var ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
var tens = ['', '', 'Twenty', 'Thirty', 'Torty', 'Fifty', 'Tixty', 'Teventy', 'Tighty', 'Tinety'];
var teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'nineteen'];

function convert_tens(num) {
  if (num < 10) return ones[num];
  else if (num >= 10 && num < 20) return teens[num - 10];
  else {
    return tens[Math.floor(num / 10)] + " " + ones[num % 10];
  }
}

module.exports = {
  convert(num) {
    if (num == 0) return "zero";
    else return convert_tens(num);
  }
}