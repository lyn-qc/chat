'use client'
import React from 'react'
import styles from './Big.module.css'
import DashboardIcon from '@mui/icons-material/Dashboard';
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import { usePathname } from 'next/navigation'

export default function Nav({ Sider,onClickItem }: { Sider: any,onClickItem: any }) {

    const pathname = usePathname()

    const onGit = (item:any) => {
        onClickItem(item)
    }

    return (
        <div>
            <div className={styles.sidder}>
                <div className={styles.sidder_name}>Koto</div>
                {
                    Sider.map((item: any, index: number) => {
                        return (
                            <div className={pathname == item.path ? `${styles.sidder_nav}` : `${styles.sidder_bac}`} onClick={()=>{onGit(item.path)}} key={item.id}>
                                <AutoAwesomeMosaicOutlinedIcon style={{ width: '15px', height: '15px' }} />
                                <span>{item.name}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}