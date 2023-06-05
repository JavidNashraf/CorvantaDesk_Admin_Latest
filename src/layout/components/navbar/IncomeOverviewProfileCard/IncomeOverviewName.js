const IncomeOverviewName = ({ incomeOverviewList, isLoggedIn }) => {
  let incomeOverviewName = '';
  if (isLoggedIn) {
    let incomeOverviewN = incomeOverviewList?.fullName? incomeOverviewList?.fullName.split(' ') :"NA "
    if (incomeOverviewN.length < 2) {
      incomeOverviewName = incomeOverviewN[0].charAt(0);
    } else {
      incomeOverviewName = incomeOverviewN[0].charAt(0) + incomeOverviewN[1].charAt(0);
    }
  }
  return incomeOverviewName.toUpperCase();
};
export default IncomeOverviewName;
