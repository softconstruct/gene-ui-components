const arrayReorder = (array, from, to) => {
    const arrayCopy = [...array];
    const [removed] = arrayCopy.splice(from, 1);

    arrayCopy.splice(to, 0, removed);
    return arrayCopy;
};

export default arrayReorder;
