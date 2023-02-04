export const formatImageUrl = (path, width) => {
  path = path.replace(
        'https://res.cloudinary.com/instavite/image/upload/',
        `https://res.cloudinary.com/instavite/image/upload/c_scale,w_${width || '400'}/`
    )
  
  const arr = path.split('.')
  arr[arr.length - 1] = 'webp'
  
  return arr.join('.')
}
