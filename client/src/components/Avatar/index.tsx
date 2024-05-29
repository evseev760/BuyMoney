import styled, { css, DefaultTheme } from "styled-components";

interface AvatarProps {
  avatar: string;
  size: number;
}

export const Avatar = (props: AvatarProps) => {
  const { avatar, size } = props;

  return (
    <StyledAvatar
      dangerouslySetInnerHTML={{
        __html: avatar,
      }}
      size={size}
    />
  );
};
export const StyledAvatar = styled.div<{ size: number }>`
  ${({ theme, size }: { theme: DefaultTheme; size: number }) => css`
    width: ${size + "px"};
    height: ${size + "px"};
    & > svg {
      border-radius: ${size / 4 + "px"};
      width: ${size + "px"};
      height: ${size + "px"};
    }
  `}
`;
