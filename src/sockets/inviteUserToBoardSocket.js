// Param socket sẽ được lấy từ thư viện socket.io https://socket.io/docs/v4/tutorial/step-5
export const inviteUserToBoardSocket = (socket) => {
  // Lắng nghe sự kiện mà client gửi/emit lên, cụ thể là: FE_USER_INVITED_TO_BOARD
  socket.on('FE_USER_INVITED_TO_BOARD', (invitation) => {
    // invitation la thong tin ma client gui len
    // console.log('inviteUserToBoard: ', invitation)
    // Emit ngược lại một sự kiện về cho mọi client khác (ngoại trừ chính cái thằng gửi request lên), rồi để phía FE check
    socket.broadcast.emit('BE_USER_INVITED_TO_BOARD', invitation)
  })
}