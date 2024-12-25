import { AxiosError } from 'axios'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { User } from '@prisma/client'
import { useAuth } from '@/src/providers/authProvider'
import { useSnackBar } from '@/src/providers/snackbarProvider'
import { userService } from '@/src/utils'
import { useTheme } from 'next-themes'
import Image from 'next/image'

interface UserProfileProps {
  userProfile: User
  onUserUpdated?: (user: User) => void
  allowDelete: boolean
}

export default function UserProfile(props: UserProfileProps) {
  const { userProfile, onUserUpdated } = props
  const { theme } = useTheme() // Get current theme
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
    <div className='h-[calc(100vh-65px)] bg-gradient-to-br from-green-100 to-green-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4'>
      <div className='w-full max-w-md backdrop-blur-sm backdrop-filter'>
        <div
          className={`max-w-2xl mx-auto p-8 rounded-2xl shadow-2xl ${
            theme === 'dark' ? 'bg-gray-800/90 text-gray-100' : 'bg-white/90 text-gray-800'
          }`}
        >
          <div className='flex flex-col items-center space-y-6'>
            <div className='relative group'>
              <label className='relative cursor-pointer block'>
                <input type='file' className='hidden' accept='image/*' />
                <div className='relative'>
                  <img
                    src={userProfile.image || '/icons/default_user_avatar2.png'}
                    alt={`${userProfile.name}`}
                    className='w-24 h-24 rounded-full object-cover ring-4 ring-green-400 transition-transform duration-300 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                    <svg
                      className='w-8 h-8 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                    </svg>
                  </div>
                </div>
              </label>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className='w-full space-y-6'
              key={userProfile.id}
              noValidate
            >
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Username
                  </label>
                  <input
                    type='text'
                    placeholder='Name'
                    {...register('name')}
                    className='w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 focus:border-transparent transition-all duration-200'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Email address
                  </label>
                  <input
                    type='email'
                    placeholder='Email Address'
                    {...register('email', { required: true })}
                    className='w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 focus:border-transparent transition-all duration-200'
                    required
                  />
                  {errors.email && (
                    <span className='text-red-500 text-sm mt-1 ml-2'>
                      Please provide an email address.
                    </span>
                  )}
                </div>
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Password
                </label>
                <input
                  type='password'
                  placeholder='Password'
                  {...register('password')}
                  className='w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 focus:border-transparent transition-all duration-200'
                  required
                />
              </div>

              <div className='space-y-4 pt-4'>
                <button
                  type='submit'
                  className='w-full py-2 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-500 dark:to-green-600 text-white text-sm rounded-lg font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-105 hover:shadow-lg'
                >
                  Update Profile
                </button>

                {props.allowDelete && (
                  <button
                    type='button'
                    onClick={handleDeleteProfile}
                    className={`w-full py-2 border-2 border-red-500 text-red-500 rounded-xl font-medium tracking-wide text-sm hover:bg-red-500 hover:text-white transition-all duration-300`}
                  >
                    Delete my account
                  </button>
                )}
              </div>
            </form>
          </div>
          {open && (
            <div
              className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${
                theme === 'dark' ? 'bg-opacity-70' : 'bg-opacity-50'
              }`}
            >
              <div
                className={`bg-white p-6 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700 text-gray-100' : ''
                }`}
              >
                <p className='mb-4'>Are you sure you want to delete your account?</p>
                <div className='flex justify-end gap-4'>
                  <button
                    onClick={handleCancel}
                    className={`px-4 py-2 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-600 text-gray-100' : 'bg-gray-300 text-gray-800'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${
                      theme === 'dark' ? 'bg-blue-600' : ''
                    }`}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
