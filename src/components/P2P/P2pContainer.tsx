import P2pItem from "./P2pItem";

const P2pContainer = () => {
  return (
    <>
      <div className={`w-full mt-8 mb-6 space-y-5`}>
        <P2pItem />
        <P2pItem />
        <P2pItem />
        <P2pItem />
      </div>
    </>
  );
};

export default P2pContainer;
