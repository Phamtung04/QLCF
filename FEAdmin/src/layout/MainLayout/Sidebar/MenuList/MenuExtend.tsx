import NavItem from './NavItem';

const MenuExtend = ({ items, handleClickItem, keyword }) => {
    return (
        <>
            {_.map(items, (item, index: number) => {
                return <NavItem key={item.id} item={item} level={1} onClickItem={handleClickItem} />;
            })}
        </>
    );
};

export default MenuExtend;
