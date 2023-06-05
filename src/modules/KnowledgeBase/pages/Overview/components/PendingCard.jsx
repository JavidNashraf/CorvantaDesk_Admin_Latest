import "./styles.scss";

function PendingCard({title, count, yellow}){
  return (
    <div className="pcardX">
      <div className="stackX">
      <div className={yellow? 'pBackroung':'pBackroung2'}></div>
        <div className="pContent">
            <div className="pBody">
            <div className="pLeft">
            <div className="pTitle">{title}</div>
            <div className={yellow? "pCount":"pCount2"}>{count}</div>
            </div>
            <div className="pRight">
                <div className="pCon">
                    <div className={yellow? "pIcon": "pIcon2"}></div>
                </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
}


export default PendingCard;