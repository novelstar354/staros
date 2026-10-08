//Ban
UPDATE public.staros_accounts
SET
    is_banned = true,
    banned_at = now(),
    ban_reason = '利用規約違反'
WHERE username = 'BANしたいユーザーネーム';

//解除
UPDATE public.staros_accounts
SET
    is_banned = false,
    banned_at = NULL,
    ban_reason = NULL
WHERE username = 'ユーザーネーム';

//一覧
SELECT
    username AS "ユーザーネーム",
    display_name AS "表示名",
    id AS "userID",
    is_banned AS "BAN",
    banned_at AS "BAN日時",
    ban_reason AS "BAN理由"
FROM public.staros_accounts
WHERE is_banned = true
ORDER BY banned_at DESC;
