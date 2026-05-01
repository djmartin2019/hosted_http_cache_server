import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createElement as h } from 'react';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..', '..');

/* Satori uses opentype.js — WOFF (not WOFF2) for font buffers */
const fontMono = readFileSync(
    join(repoRoot, 'node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff')
);
const fontSyne = readFileSync(
    join(repoRoot, 'node_modules/@fontsource/syne/files/syne-latin-600-normal.woff')
);

const fonts = [
    { name: 'Syne', data: fontSyne, weight: 600, style: 'normal' },
    { name: 'JetBrains Mono', data: fontMono, weight: 400, style: 'normal' }
];

const W = 1200;
const H = 630;

function corners() {
    const mk = (key, style) => h('div', { key, style: { position: 'absolute', borderColor: '#2dd4bf', borderStyle: 'solid', ...style } });
    return [
        mk('tl', { top: 36, left: 36, width: 20, height: 20, borderLeftWidth: 2, borderTopWidth: 2 }),
        mk('tr', { top: 36, right: 36, width: 20, height: 20, borderRightWidth: 2, borderTopWidth: 2 }),
        mk('bl', { bottom: 36, left: 36, width: 20, height: 20, borderLeftWidth: 2, borderBottomWidth: 2 }),
        mk('br', { bottom: 36, right: 36, width: 20, height: 20, borderRightWidth: 2, borderBottomWidth: 2 })
    ];
}

function statTile(label, value) {
    return h(
        'div',
        {
            style: {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '16px 14px',
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: 'rgba(255,255,255,0.1)',
                minWidth: 0
            }
        },
        h(
            'div',
            {
                style: {
                    fontFamily: 'JetBrains Mono',
                    fontSize: 11,
                    letterSpacing: 2,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    marginBottom: 8
                }
            },
            label
        ),
        h(
            'div',
            {
                style: {
                    fontFamily: 'Syne',
                    fontSize: 34,
                    fontWeight: 600,
                    color: '#e6e7ec',
                    letterSpacing: -1
                }
            },
            String(value)
        )
    );
}

/**
 * @param {object|null} user - GitHub API user JSON, or null for 404 card
 * @param {string|null} avatarDataUrl - optional data URL for avatar image
 */
export async function renderOgPng(user, avatarDataUrl) {
    const is404 = !user;

    const innerChildren = [
        h(
            'div',
            {
                key: 'badge',
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 28
                }
            },
            h(
                'div',
                {
                    style: {
                        fontSize: 22,
                        color: '#8b5cff',
                        fontFamily: 'Syne',
                        fontWeight: 600
                    }
                },
                '✦'
            ),
            h(
                'div',
                {
                    style: {
                        fontFamily: 'JetBrains Mono',
                        fontSize: 13,
                        letterSpacing: 3,
                        color: '#2dd4bf',
                        textTransform: 'uppercase'
                    }
                },
                'GitHub card'
            )
        ),
        h(
            'div',
            {
                key: 'row',
                style: {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 40,
                    flex: 1,
                    minHeight: 0
                }
            },
            h(
                'div',
                { key: 'ava', style: { display: 'flex', flexShrink: 0 } },
                avatarDataUrl && !is404
                    ? h('img', {
                          src: avatarDataUrl,
                          width: 200,
                          height: 200,
                          style: {
                              borderRadius: 22,
                              objectFit: 'cover',
                              borderWidth: 3,
                              borderStyle: 'solid',
                              borderColor: '#8b5cff'
                          }
                      })
                    : h('div', {
                          style: {
                              width: 200,
                              height: 200,
                              borderRadius: 22,
                              backgroundColor: 'rgba(255,255,255,0.06)',
                              borderWidth: 3,
                              borderStyle: 'solid',
                              borderColor: 'rgba(139,92,255,0.4)'
                          }
                      })
            ),
            h(
                'div',
                {
                    key: 'meta',
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        minWidth: 0,
                        gap: 10
                    }
                },
                ...[
                    h(
                        'div',
                        {
                            key: 'eyebrow',
                            style: {
                                fontFamily: 'JetBrains Mono',
                                fontSize: 12,
                                letterSpacing: 4,
                                color: '#6b7280',
                                textTransform: 'uppercase'
                            }
                        },
                        is404 ? 'Not found' : 'Shareable profile'
                    ),
                    h(
                        'div',
                        {
                            key: 'name',
                            style: {
                                fontFamily: 'Syne',
                                fontSize: 54,
                                fontWeight: 600,
                                color: '#f3f4f6',
                                letterSpacing: -2,
                                lineHeight: 1.05,
                                maxWidth: 720
                            }
                        },
                        is404 ? 'User unavailable' : `@${user.login}`
                    ),
                    !is404
                        ? h(
                              'div',
                              {
                                  key: 'sub',
                                  style: {
                                      fontFamily: 'JetBrains Mono',
                                      fontSize: 15,
                                      color: '#9ca3af',
                                      marginTop: 4
                                  }
                              },
                              `${user.public_repos} repos · ${user.followers} followers · ${user.following} following`
                          )
                        : null
                ].filter(Boolean)
            )
        )
    ];

    if (!is404) {
        innerChildren.push(
            h(
                'div',
                {
                    key: 'stats',
                    style: {
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 14,
                        marginTop: 24
                    }
                },
                statTile('Public repos', user.public_repos),
                statTile('Followers', user.followers),
                statTile('Following', user.following),
                statTile(
                    'Account age',
                    `${((Date.now() - new Date(user.created_at)) / (1000 * 60 * 60 * 24 * 365)).toFixed(1)} yrs`
                )
            )
        );
    }

    const tree = h(
        'div',
        {
            style: {
                width: W,
                height: H,
                display: 'flex',
                position: 'relative',
                backgroundColor: '#050506',
                fontFamily: 'Syne'
            }
        },
        h('div', {
            style: {
                position: 'absolute',
                inset: 0,
                background:
                    'radial-gradient(ellipse 80% 70% at 18% 12%, rgba(139,92,255,0.45), transparent 55%), radial-gradient(ellipse 60% 50% at 88% 88%, rgba(45,212,191,0.2), transparent 50%)'
            }
        }),
        h('div', {
            style: {
                position: 'absolute',
                inset: 0,
                opacity: 0.12,
                backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
                backgroundSize: '48px 48px'
            }
        }),
        h(
            'div',
            {
                style: {
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    padding: 48,
                    boxSizing: 'border-box'
                }
            },
            ...innerChildren.filter(Boolean)
        ),
        ...corners()
    );

    const svg = await satori(tree, { width: W, height: H, fonts });
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: W } });
    const pngData = resvg.render();
    return Buffer.from(pngData.asPng());
}
