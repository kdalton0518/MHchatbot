import { AxiosError } from 'axios'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { User } from '@prisma/client'
import { useAuth } from '@/src/providers/auth-provider'
import { useSnackBar } from '@/src/providers/snackbar-provider'
import { userService } from '@/src/utils'

interface UserProfileProps {
  userProfile: User
  onUserUpdated?: (user: User) => void
  allowDelete: boolean
}

export default function UserProfile(props: UserProfileProps) {
  const { userProfile, onUserUpdated } = props
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({
    defaultValues: userProfile,
  })
  const { user: currentUser, setUser, logout } = useAuth()
  const { showSnackBar } = useSnackBar()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    reset(userProfile)
  }, [reset, userProfile])

  const onSubmit: SubmitHandler<User> = async (data) => {
    let updatedUser: User
    try {
      if (currentUser?.id === userProfile.id) {
        updatedUser = await userService.updateProfile(data)
        setUser(updatedUser)
        showSnackBar('User profile updated successfully.', 'success')
      } else {
        updatedUser = await userService.updateUser(userProfile.id, data)
        showSnackBar('User profile updated successfully.', 'success')
      }
      if (onUserUpdated) {
        onUserUpdated(updatedUser)
      }
    } catch (error) {
      const msg =
        error instanceof AxiosError &&
        error.response &&
        typeof error.response.data.detail === 'string'
          ? error.response.data.detail
          : error instanceof Error
          ? error.message
          : String(error)
      showSnackBar(msg, 'error')
    }
  }

  const handleDeleteProfile = () => setOpen(true)

  const handleCancel = () => setOpen(false)

  const handleConfirm = async () => {
    setOpen(false)
    await userService.deleteSelf()
    showSnackBar('Your account has been deleted.', 'success')
    logout()
    redirect('/')
  }

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <div className='flex flex-col items-center'>
        <label className='relative cursor-pointer'>
          <input type='file' className='hidden' accept='image/*' />
          <img
            src={userProfile.image || undefined}
            alt={`${userProfile.name}`}
            className='w-14 h-14 rounded-full object-cover'
          />
        </label>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='w-full mt-6 space-y-4'
          key={userProfile.id}
          noValidate
        >
          <div>
            <input
              type='text'
              placeholder='Name'
              {...register('name')}
              className='w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none'
            />
          </div>
          <div>
            <input
              type='email'
              placeholder='Email Address'
              {...register('email', { required: true })}
              className={`w-full p-2 border rounded-lg focus:ring focus:ring-blue-500 focus:outline-none ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <span className='text-red-500 text-sm'>Please provide an email address.</span>
            )}
          </div>
          <input
            type='password'
            placeholder='Password'
            {...register('password')}
            className='w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none'
          />
          <button
            type='submit'
            className='w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
          >
            Update
          </button>
          {props.allowDelete && (
            <button
              type='button'
              onClick={handleDeleteProfile}
              className='w-full py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white'
            >
              Delete my account
            </button>
          )}
        </form>
      </div>
      {open && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-6 rounded-lg'>
            <p className='text-gray-700 mb-4'>Are you sure you want to delete your account?</p>
            <div className='flex justify-end gap-4'>
              <button
                onClick={handleCancel}
                className='px-4 py-2 bg-gray-300 text-gray-800 rounded-lg'
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className='px-4 py-2 bg-blue-500 text-white rounded-lg'
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
