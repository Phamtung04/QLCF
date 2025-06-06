import NavItem from './NavItem';

const MenuCompact = ({ items, handleClickItem }) => {
    return (
        <>
            {_.map(items, (item, index: number) => {
                return <NavItem key={item.id} item={item} level={1} onClickItem={handleClickItem} />;
            })}
        </>
    );
};

export default MenuCompact;
