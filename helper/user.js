import userschema from '../schema/user.js'

export const findUserIdentificationInPosts = (_id) => {
  return new Promise((resolve, reject) => {
    var username = '', avatar = '', message = '';
    userschema.findOne({ 
      _id: _id
    }).exec((err, user) => {
      if (err) {
        const objErrMsg = JSON.stringify(err);
        message = objErrMsg.message || err.message || 'err'

        console.log(message)
        console.log(objErrMsg.message, err.message, 'err')
        
        reject({ username, avatar, message })
      } 

      if (!user) {
        message = "User not found"

        reject({ username, avatar, message })
      } else {
        username = user.username;
        avatar = user.avatar;

        resolve({ username, avatar, message })
      }
    })
  })
}