e-- Ban
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


SELECT
    a.username AS "ユーザーネーム",
    a.display_name AS "表示名",
    'STAR-' || LPAD(
        ROW_NUMBER() OVER (ORDER BY a.created_at)::text,
        6,
        '0'
    ) AS "StarID",
    a.id AS "userID",
    a.password_hash AS "password hash",
    s.last_login AS "最終ログイン日時"
FROM public.staros_accounts AS a
LEFT JOIN (
    SELECT
        user_id,
        MAX(created_at) AS last_login
    FROM public.staros_sessions
    GROUP BY user_id
) AS s
    ON s.user_id = a.id
ORDER BY a.created_at;

-- 再設定
SELECT public.staros_admin_reset_password(
    'ここに管理者キー',
    '対象のUser ID',
    '新しいパスワード'
);

SELECT public.staros_admin_coin_adjust(
    'staruser01',
    'gift',
    500,
    'イベント報酬'
);

SELECT public.staros_admin_coin_adjust(
    'staruser01',
    'confiscate',
    300,
    '管理上の調整'
);

-- 全員配布
SELECT public.staros_admin_coin_broadcast(
    500::bigint,
    '全員配布イベント'
);



SELECT public.staros_admin_coin_reduce_all(
    100,
    '全員一律減額'
);


--log
SELECT *
FROM public.staros_coin_admin_log
ORDER BY created_at DESC
LIMIT 100;

--一覧
SELECT *
FROM public.staros_gifts
ORDER BY created_at DESC
LIMIT 100;
