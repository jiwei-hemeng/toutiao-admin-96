import require from '@/utils/require'
export const login = data => {
  return require({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    data
  })
}
// 获取用户信息
// export const getUserInfo = () => {

// }

// 修改用户信息
// export const updateUser = () => {

// }