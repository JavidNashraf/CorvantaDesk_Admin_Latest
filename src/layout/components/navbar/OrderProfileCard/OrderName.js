import { useSelector } from "react-redux";

const OrderName = () => {
    const { order } = useSelector((state) => state?.orders);
    const { isLoggedIn } = useSelector((state) => state.auth);
  let orderName = "";
  if (isLoggedIn) {
    let orderN = order?.clientFullName? order?.clientFullName.split(" ") : "NA"
    if (orderN.length < 2) {
        orderName = orderN[0].charAt(0);
    }else{
        orderName = orderN[0].charAt(0) + orderN[1].charAt(0);

    }
  }
  return orderName.toUpperCase();
};
export default OrderName;
