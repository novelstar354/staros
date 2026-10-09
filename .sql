-- Ban
UPDATE public.staros_accounts
SET
    is_banned = true,
    banned_at = now(),
    ban_reason = '利用規約違反'
WHERE username = 'ユーザー名';

DELETE FROM public.staros_sessions
WHERE user_id = (
    SELECT id
    FROM public.staros_accounts
    WHERE username = 'ユーザー名'
);

-- 解除
UPDATE public.staros_accounts
SET
    is_banned = false,
    banned_at = NULL,
    ban_reason = NULL
WHERE username = 'ユーザー名';

-- ban一覧
SELECT
    username AS "ユーザーネーム",
    display_name AS "表示名",
    id AS "userID",
    banned_at AS "BAN日時",
    ban_reason AS "BAN理由"
FROM public.staros_accounts
WHERE is_banned = true
ORDER BY banned_at DESC;

-- 一覧　ban,noramal含む
SELECT
    username AS "ユーザーネーム",
    display_name AS "表示名",
    id AS "userID",
    is_banned AS "BAN",
    banned_at AS "BAN日時",
    ban_reason AS "BAN理由",
    created_at AS "登録日時"
FROM public.staros_accounts
ORDER BY created_at ASC;

-- 再設定
SELECT public.staros_admin_reset_password(
    'ここに管理者キー',
    '対象のUser ID',
    '新しいパスワード'
);
