export const routerPath = (path, file) => {
    return () => import(`@/views${path}/${file}`)
}

export const layoutView = (file) => {
    return map[file] || map['layoutView'];
}

const map = {
    layoutView:() => import('@/views/layoutView')
}