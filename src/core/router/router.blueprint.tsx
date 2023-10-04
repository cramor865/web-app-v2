import { ComponentType } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, RouteObject, createBrowserRouter, useRouteError } from 'react-router-dom';
import Layout from 'src/components/templates/refactored/layout/layout';
import {
  jobs,
  createChat,
  chatMessages,
  getChatParticipantsById,
  chats,
  getFollowings,
  notificationSettings,
  notifications,
  posts,
  getPost,
  postComments,
  missions,
  stripeProfile,
} from 'src/core/api';
import FallBack from 'src/pages/fall-back/fall-back';
import { RootState } from 'src/store';

export const blueprint: RouteObject[] = [
  { path: '/', element: <DefaultRoute /> },
  {
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: 'feeds',
            async lazy() {
              const { Feeds } = await import('src/pages/feed/refactored/feed');
              return {
                Component: Feeds,
              };
            },
            loader: () => posts({ page: 1 }),
          },
          {
            path: 'feeds/:id',
            async lazy() {
              const { FeedDetails } = await import('src/pages/feed/refactored/feedDetails/feedDetails');
              return {
                Component: FeedDetails,
              };
            },
            loader: async ({ params }) => {
              const requests = [getPost(params.id!), postComments(params.id!, { page: 1 })];
              const [post, comments] = await Promise.all(requests);
              return { post, comments };
            },
          },
          {
            path: 'jobs',
            async lazy() {
              const { Jobs } = await import('src/pages/jobs');
              const jobsList = await jobs({ page: 1 });
              return {
                Component: Jobs,
                Loader: jobsList,
              };
            },
          },
          {
            path: 'd/chats',
            children: [
              {
                path: 'new/:id',
                async lazy() {
                  const { NewChat } = await import('src/pages/chat/new-chat/new-chat');
                  return {
                    Component: Protect(NewChat),
                  };
                },
                loader: async ({ params }) => {
                  const createdChats = await createChat({ name: 'nameless', type: 'CHAT', participants: [params.id] });
                  return createdChats?.id;
                },
              },
              {
                path: 'contacts/:id',
                async lazy() {
                  const { MessageDetail } = await import('src/pages/chat/message-detail/message-detail.container');
                  return {
                    Component: Protect(MessageDetail),
                  };
                },
                loader: async ({ params }) => {
                  const requests = [
                    chatMessages(params.id, { page: 1 }),
                    getChatParticipantsById(params.id),
                    chats({ page: 1 }),
                    getFollowings({ page: 1 }),
                  ];
                  const [messages, participants, summery, followings] = await Promise.all(requests);
                  return {
                    messages,
                    participants,
                    summery,
                    followings,
                  };
                },
              },
              {
                path: 'contacts',
                async lazy() {
                  const { ContactList } = await import('src/pages/chat/contact-list/contact-list.container');
                  return {
                    Component: Protect(ContactList),
                  };
                },
                loader: async () => {
                  const requests = [chats({ page: 1 }), getFollowings({ page: 1 })];
                  const [summery, followings] = await Promise.all(requests);
                  return { summery, followings };
                },
              },
            ],
          },
          {
            path: 'notifications',
            children: [
              {
                path: '',
                async lazy() {
                  const { Notifications } = await import('src/pages/notifications/notifications.container');
                  return {
                    Component: Protect(Notifications),
                  };
                },
                loader: () => notifications({ page: 1 }),
              },
              {
                path: 'settings',
                async lazy() {
                  const { Settings } = await import('src/pages/notifications/settings/settings.container');
                  return {
                    Component: Protect(Settings),
                  };
                },
                loader: () => notificationSettings(),
              },
            ],
          },
          {
            path: 'wallet',
            async lazy() {
              const { Wallet } = await import('src/pages/wallet/wallet.container');

              return {
                Component: Protect(Wallet),
              };
            },
            loader: async () => {
              const requests = [missions({ page: 1 }), stripeProfile({}), stripeProfile({ is_jp: true })];
              const [missionsList, stripeProfileRes, jpStripeProfileRes] = await Promise.all(requests);
              return { missionsList, stripeProfileRes, jpStripeProfileRes };
            },
          },
          {
            path: 'organization',
            children: [
              {
                path: 'create',
                children: [
                  {
                    path: 'intro',
                    async lazy() {
                      const { Intro } = await import('src/pages/organization-create/intro/intro');
                      return {
                        Component: Intro,
                      };
                    },
                  },
                  {
                    path: 'type',
                    async lazy() {
                      const { Type } = await import('src/pages/organization-create/type/type');
                      return {
                        Component: Type,
                      };
                    },
                  },
                  {
                    path: 'social-causes',
                    async lazy() {
                      const { SocialCauses } = await import(
                        'src/pages/organization-create/social-causes/social-causes'
                      );
                      return {
                        Component: SocialCauses,
                      };
                    },
                  },
                  {
                    path: 'profile',
                    async lazy() {
                      const { Profile } = await import('src/pages/organization-create/profile/profile');
                      return {
                        Component: Profile,
                      };
                    },
                  },
                  {
                    path: 'mission',
                    async lazy() {
                      const { Mission } = await import('src/pages/organization-create/mission/mission');
                      return {
                        Component: Mission,
                      };
                    },
                  },
                  {
                    path: 'culture',
                    async lazy() {
                      const { Culture } = await import('src/pages/organization-create/culture/culture');
                      return {
                        Component: Culture,
                      };
                    },
                  },
                  {
                    path: 'social-impact',
                    async lazy() {
                      const { SocialImpact } = await import(
                        'src/pages/organization-create/social-impact/social-impact'
                      );
                      return {
                        Component: SocialImpact,
                      };
                    },
                  },
                  {
                    path: 'succeed',
                    async lazy() {
                      const { Succeed } = await import('src/pages/organization-create/succeed/succeed');
                      return {
                        Component: Succeed,
                      };
                    },
                  },
                  {
                    path: 'verified',
                    async lazy() {
                      const { Verified } = await import('src/pages/organization-create/verified/verified');
                      return {
                        Component: Verified,
                      };
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    errorElement: <ErrorBoundary />,
  },
  {
    path: 'sign-up',
    children: [
      {
        path: 'user',
        children: [
          {
            path: 'email',
            async lazy() {
              const { SignUpUserEmailContainer } = await import(
                'src/pages/sign-up/sign-up-user-email/sign-up-user-email.container'
              );
              return {
                Component: SignUpUserEmailContainer,
              };
            },
          },
          {
            path: 'verification',
            async lazy() {
              const { SignUpUserVerificationContainer } = await import(
                'src/pages/sign-up/sign-up-user-verification/sign-up-user-verification.container'
              );
              return {
                Component: SignUpUserVerificationContainer,
              };
            },
          },
          {
            path: 'complete',
            async lazy() {
              const { SignUpUserCompleteContainer } = await import(
                'src/pages/sign-up/sign-up-user-complete/sign-up-user-complete.container'
              );
              return {
                Component: SignUpUserCompleteContainer,
              };
            },
          },
          {
            path: 'welcome',
            async lazy() {
              const { Welcome } = await import('src/pages/sign-up/welcome/welcome');
              return {
                Component: Welcome,
              };
            },
          },
          {
            path: 'onboarding',
            async lazy() {
              const { SignUpUserOnboarding } = await import(
                'src/pages/sign-up/sign-up-user-onboarding/sign-up-user-complete.container'
              );
              return {
                Component: SignUpUserOnboarding,
              };
            },
          },
          {
            path: 'allow-notification',
            async lazy() {
              const { AllowNotification } = await import('src/pages/sign-up/AllowNotification');
              return {
                Component: AllowNotification,
              };
            },
          },
        ],
      },
    ],
  },
  {
    path: 'forget-password',
    children: [
      {
        path: 'email',
        async lazy() {
          const { Email } = await import('src/pages/forget-password/email/email.container');
          return {
            Component: Email,
          };
        },
      },
      {
        path: 'otp',
        async lazy() {
          const { Otp } = await import('src/pages/forget-password/otp/otp.container');
          return {
            Component: Otp,
          };
        },
      },
      {
        path: 'password',
        async lazy() {
          const { Password } = await import('src/pages/forget-password/password/password.container');
          return {
            Component: Password,
          };
        },
      },
    ],
  },
  {
    path: '/intro',
    async lazy() {
      const { Intro } = await import('src/pages/intro/intro');
      return {
        Component: Intro,
      };
    },
  },
  {
    path: '/sign-in',
    async lazy() {
      const { SignInContainer } = await import('src/pages/sign-in/sign-in-container');
      return {
        Component: SignInContainer,
      };
    },
  },
];

function Protect<T extends {}>(Component: ComponentType<T>): ComponentType<T> {
  return function ProtectedRoute(props: T) {
    const status = useSelector((state: RootState) => state.identity.status);
    // TODO: We may notify user before redirect to intro page
    if (status === 'loading') return <div></div>;
    if (status === 'failed') return <Navigate to="/intro" />;
    return <Component {...props} />;
  };
}

function DefaultRoute(): JSX.Element {
  const status = useSelector((state: RootState) => state.identity.status);
  console.log(status);
  if (status === 'succeeded') return <Navigate to="/jobs" />;

  if (status === 'loading') return <div></div>;
  if (status === 'failed') return <Navigate to="/intro" />;

  return <Navigate to="/jobs" />;
}

function ErrorBoundary() {
  const error: any = useRouteError();
  if (error?.response?.status === 401) return <Navigate to="/intro" />;
  return <FallBack />;
}

export const routes = createBrowserRouter(blueprint);
