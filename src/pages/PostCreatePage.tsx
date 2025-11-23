import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { PostForm, type PostFormValues } from '../components/post/PostForm'
import { dormApi } from '../api/dormApi'
import { postApi } from '../api/postApi'
import { Card } from '../components/common/Card'
import { useAuth } from '../hooks/useAuth'

export function PostCreatePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: dorms = [] } = useQuery({ queryKey: ['dormitories'], queryFn: dormApi.list })

  const createMutation = useMutation({
    mutationFn: (values: PostFormValues) =>
      postApi.create({
        ...values,
        party:
          values.category === 'general'
            ? undefined
            : values.party && {
                max_member: values.party.max_member,
                deadline: values.party.deadline ?? null,
                location: values.party.location ?? null,
              },
      }),
    onSuccess: (post) => navigate(`/posts/${post.post_id}`),
  })

  return (
    <Card className="space-y-6">
      <div>
        <p className="text-sm text-surface-500">새로운 모집글을 작성하세요</p>
        <h1 className="text-2xl font-bold text-surface-900">게시글 작성</h1>
      </div>
      <PostForm
        dormitories={dorms}
        defaultDormId={user?.dorm_id ?? dorms[0]?.dorm_id}
        onSubmit={async (values) => {
          await createMutation.mutateAsync(values)
        }}
        isSubmitting={createMutation.isPending}
      />
    </Card>
  )
}
